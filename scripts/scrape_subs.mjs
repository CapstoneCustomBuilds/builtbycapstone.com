#!/usr/bin/env node

/**
 * Tampa Bay Subcontractor Scraper (Node.js)
 * Uses Google Places API (New) Text Search to find subs by trade.
 * Searches multiple zones across Tampa Bay for maximum coverage.
 *
 * Usage:
 *   Add GOOGLE_PLACES_API_KEY=your-key to .env.local, then:
 *
 *   node scripts/scrape_subs.mjs --trade "roofing contractor"   # single trade
 *   node scripts/scrape_subs.mjs --all                           # run all trades
 *   node scripts/scrape_subs.mjs --list                          # show available trades
 *
 * No npm install needed — uses only Node built-ins.
 * Outputs CSV (opens directly in Excel/Google Sheets).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";

// Load .env.local from project root (walks up from scripts/ dir)
const __dirname = dirname(fileURLToPath(import.meta.url));
for (const envFile of [".env.local", ".env"]) {
  const envPath = resolve(__dirname, "..", envFile);
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf-8").split("\n")) {
      const match = line.match(/^\s*([\w]+)\s*=\s*(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
    break;
  }
}

// Ensure scripts/output/ exists
const OUTPUT_DIR = resolve(__dirname, "output");
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error("ERROR: Set GOOGLE_PLACES_API_KEY in .env.local or as env var");
  process.exit(1);
}

// Search zones across Tampa Bay metro — 15km radius each, overlapping for coverage
const SEARCH_ZONES = [
  { name: "Downtown Tampa",  lat: 27.9506, lng: -82.4572 },
  { name: "Brandon/Riverview", lat: 27.8986, lng: -82.2868 },
  { name: "Valrico",          lat: 27.9375, lng: -82.2362 },
  { name: "Wesley Chapel",   lat: 28.2395, lng: -82.3275 },
  { name: "Carrollwood/Lutz", lat: 28.0755, lng: -82.4950 },
  { name: "St. Petersburg",  lat: 27.7676, lng: -82.6403 },
  { name: "Clearwater",      lat: 27.9659, lng: -82.8001 },
  { name: "Largo/Seminole",  lat: 27.8948, lng: -82.7539 },
  { name: "Plant City",      lat: 28.0186, lng: -82.1193 },
  { name: "New Port Richey", lat: 28.2444, lng: -82.7193 },
  { name: "Bradenton",       lat: 27.4989, lng: -82.5749 },
  { name: "Lakeland",        lat: 28.0395, lng: -81.9498 },
  { name: "Sarasota",        lat: 27.3364, lng: -82.5307 },
];
const ZONE_RADIUS = 15000; // 15km per zone

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.googleMapsUri",
  "nextPageToken",
].join(",");

const TRADES = [
  "framing contractor",
  "roofing contractor",
  "electrician",
  "plumber",
  "HVAC contractor",
  "concrete contractor",
  "drywall contractor",
  "painter",
  "flooring contractor",
  "landscaping contractor",
  "fence contractor",
  "insulation contractor",
  "foundation contractor",
  "demolition contractor",
  "excavation contractor",
  "masonry contractor",
  "siding contractor",
  "window installer",
  "cabinet installer",
  "general contractor",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function searchPlaces(query, zone, pageToken = null) {
  const body = {
    textQuery: query,
    pageSize: 20,
    locationBias: {
      circle: {
        center: { latitude: zone.lat, longitude: zone.lng },
        radius: ZONE_RADIUS,
      },
    },
  };

  if (pageToken) body.pageToken = pageToken;

  const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Places search failed (${resp.status}): ${errText}`);
  }

  return resp.json();
}

async function searchZone(query, zone, seenIds) {
  const results = [];

  let data = await searchPlaces(query, zone);
  for (const r of data.places || []) {
    if (!seenIds.has(r.id)) {
      seenIds.add(r.id);
      results.push(r);
    }
  }

  let page = 1;
  while (data.nextPageToken && page < 3) {
    await sleep(1000);
    data = await searchPlaces(query, zone, data.nextPageToken);
    for (const r of data.places || []) {
      if (!seenIds.has(r.id)) {
        seenIds.add(r.id);
        results.push(r);
      }
    }
    page++;
  }

  return results;
}

async function scrapeTrade(trade) {
  const allResults = [];
  const seenIds = new Set();
  console.log(`  Searching: ${trade}...`);

  for (const zone of SEARCH_ZONES) {
    const query = `${trade} near ${zone.name} FL`;
    const results = await searchZone(query, zone, seenIds);
    if (results.length > 0) {
      allResults.push(...results);
      console.log(`    ${zone.name}: +${results.length} new`);
    }
    await sleep(500);
  }

  console.log(`    Total: ${allResults.length} unique results across ${SEARCH_ZONES.length} zones`);
  return allResults;
}

function escapeCsv(val) {
  const str = String(val ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsv(allData, filename) {
  const headers = [
    "Trade",
    "Business Name",
    "Address",
    "Phone",
    "Website",
    "Google Rating",
    "Total Reviews",
    "Google Maps Link",
    "Status",
    "Notes",
  ];

  const rows = [headers.map(escapeCsv).join(",")];

  for (const [trade, results] of Object.entries(allData)) {
    const tradeName = trade.replace(" contractor", "").replace(" installer", "");
    for (const place of results) {
      rows.push(
        [
          tradeName,
          place.displayName?.text || "",
          place.formattedAddress || "",
          place.nationalPhoneNumber || "",
          place.websiteUri || "",
          place.rating || "",
          place.userRatingCount || "",
          place.googleMapsUri || "",
          "New",
          "",
        ]
          .map(escapeCsv)
          .join(",")
      );
    }
  }

  writeFileSync(filename, rows.join("\n"), "utf-8");
  console.log(`\nSaved to ${filename}`);
}

async function main() {
  const { values } = parseArgs({
    options: {
      trade: { type: "string" },
      all: { type: "boolean", default: false },
      list: { type: "boolean", default: false },
      output: { type: "string" },
    },
  });

  if (!values.trade && !values.all && !values.list) {
    console.log("Usage:");
    console.log('  node scrape_subs.mjs --trade "roofing contractor"');
    console.log("  node scrape_subs.mjs --all");
    console.log("  node scrape_subs.mjs --list");
    process.exit(1);
  }

  if (values.list) {
    console.log("Available trades:");
    TRADES.forEach((t, i) =>
      console.log(`  ${String(i + 1).padStart(2)}. ${t}`)
    );
    console.log(`\nRun one:  node scrape_subs.mjs --trade "${TRADES[1]}"`);
    console.log(`Run all:  node scrape_subs.mjs --all`);
    return;
  }

  console.log("==================================================");
  console.log("Capstone Custom Builds — Sub Scraper (Node)");
  console.log(`Searching ${SEARCH_ZONES.length} zones across Tampa Bay`);
  console.log("==================================================");

  let allData = {};
  let filename;

  if (values.trade) {
    const trade = values.trade.toLowerCase().trim();
    console.log(`\nSingle trade mode: ${trade}`);
    const results = await scrapeTrade(trade);
    allData[trade] = results;
    filename =
      values.output || resolve(OUTPUT_DIR, `tampa_subs_${trade.replace(/\s+/g, "_")}.csv`);
  } else {
    console.log(`\nRunning all ${TRADES.length} trades...`);
    for (const trade of TRADES) {
      const results = await scrapeTrade(trade);
      allData[trade] = results;
      await sleep(1000);
    }
    filename = values.output || resolve(OUTPUT_DIR, "tampa_subcontractors.csv");
  }

  buildCsv(allData, filename);

  const total = Object.values(allData).reduce((s, r) => s + r.length, 0);
  console.log(
    `\nDone! ${total} subcontractors across ${Object.keys(allData).length} trade(s).`
  );
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
