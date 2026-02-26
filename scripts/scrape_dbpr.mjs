#!/usr/bin/env node

/**
 * Florida DBPR License Database Scraper (Node.js)
 * Downloads free public CSV of all FL construction + electrical contractors,
 * filters to Tampa/Hillsborough area, outputs a clean CSV by trade.
 *
 * Usage:
 *   node scripts/scrape_dbpr.js              # run with defaults
 *   node scripts/scrape_dbpr.js --output my_subs.csv
 *
 * No npm install needed — uses only Node built-ins.
 * No API key needed — this is free public data from the state.
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "util";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "output");
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

const CONSTRUCTION_URL =
  "https://www2.myfloridalicense.com/sto/file_download/extracts/CONSTRUCTIONLICENSE_1.csv";
const ELECTRICAL_URL =
  "https://www2.myfloridalicense.com/sto/file_download/extracts/ELECTRICALLICENSE_1.csv";

// Hillsborough=39, Pinellas=62, Pasco=61, Manatee=51, Polk=63, Hernando=37, Sarasota=68
const TAMPA_COUNTY_CODES = new Set(["39", "62", "61", "51", "63", "37", "68"]);
const COUNTY_NAMES = {
  "39": "Hillsborough",
  "62": "Pinellas",
  "61": "Pasco",
  "51": "Manatee",
  "63": "Polk",
  "37": "Hernando",
  "68": "Sarasota",
};

// License type prefixes from actual DBPR CSV data
const TRADE_MAP = {
  CAC: "HVAC / Air Conditioning (Cert)",
  CBC: "Building Contractor (Cert)",
  CCC: "Roofing (Cert)",
  CFC: "Plumbing (Cert)",
  CGC: "General Contractor (Cert)",
  CMC: "Mechanical (Cert)",
  CPC: "Pool / Spa (Cert)",
  CRC: "Residential Contractor (Cert)",
  CUC: "Utility & Excavation (Cert)",
  CVC: "Solar (Cert)",
  CSC: "Specialty Contractor (Cert)",
  SCC: "Specialty Contractor (County)",
  PCC: "Pollutant Storage",
  RA: "HVAC / Air Conditioning (Reg)",
  RB: "Building Contractor (Reg)",
  RC: "Roofing (Reg)",
  RF: "Plumbing (Reg)",
  RG: "General Contractor (Reg)",
  RM: "Mechanical (Reg)",
  RQ: "Pool / Spa (Reg)",
  RR: "Residential Contractor (Reg)",
  RS: "Sheet Metal (Reg)",
  RU: "Utility & Excavation (Reg)",
  RX: "Specialty Contractor (Reg)",
  QB: "Electrical Contractor",
  FRO: "Fire Protection",
  PVDR: "Provider",
  CRS1: "Certified Roofing (Specialty)",
};

const TRADE_GROUPS = {
  "General Contractor": ["CGC", "RG"],
  "Residential Contractor": ["CRC", "RR"],
  "Building Contractor": ["CBC", "RB"],
  Roofing: ["CCC", "RC", "CRS1"],
  Plumbing: ["CFC", "RF"],
  HVAC: ["CAC", "RA"],
  Electrical: ["QB"],
  Mechanical: ["CMC", "RM"],
  "Sheet Metal": ["RS"],
  "Pool & Spa": ["CPC", "RQ"],
  "Utility & Excavation": ["CUC", "RU"],
  Solar: ["CVC"],
  Specialty: ["CSC", "SCC", "RX"],
  "Fire Protection": ["FRO"],
};

// DBPR CSV columns (quote/comma delimited)
const COLUMNS = [
  "board_number",
  "occupation_code",
  "licensee_name",
  "dba_name",
  "class_code",
  "address1",
  "address2",
  "address3",
  "city",
  "state",
  "zip",
  "county_code",
  "license_number",
  "primary_status",
  "secondary_status",
  "original_license_date",
  "effective_date",
  "expiration_date",
  "blank",
  "renewal_period",
  "alternate_license",
];

async function downloadCsv(url, label) {
  console.log(`Downloading ${label} license data...`);
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to download ${label}: ${resp.status}`);
  const text = await resp.text();
  const sizeMb = (new TextEncoder().encode(text).length / 1024 / 1024).toFixed(1);
  console.log(`  Downloaded ${sizeMb} MB`);
  return text;
}

function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseRecords(csvText) {
  const lines = csvText.split("\n").filter((l) => l.trim());
  const records = [];

  for (const line of lines) {
    const fields = parseCsvLine(line);
    if (fields.length < 15) continue;

    const record = {};
    COLUMNS.forEach((col, i) => {
      record[col] = (fields[i] || "").trim();
    });
    records.push(record);
  }

  return records;
}

function filterTampaActive(records) {
  return records.filter(
    (r) =>
      TAMPA_COUNTY_CODES.has(r.county_code) &&
      r.primary_status === "C" &&
      r.secondary_status === "A"
  );
}

function escapeCsv(val) {
  const str = String(val ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsv(records, filename) {
  const headers = [
    "Trade Group",
    "Trade",
    "Business / Licensee Name",
    "DBA Name",
    "License #",
    "Class",
    "Address",
    "City",
    "State",
    "Zip",
    "County",
    "Licensed Since",
    "Expires",
    "Status",
    "Notes",
  ];

  const rows = [headers.map(escapeCsv).join(",")];

  // Build a lookup of occupation code -> group name
  const codeToGroup = {};
  for (const [group, codes] of Object.entries(TRADE_GROUPS)) {
    for (const code of codes) {
      codeToGroup[code] = group;
    }
  }

  // Sort by trade group then name
  const sorted = [...records].sort((a, b) => {
    const ga = codeToGroup[a.occupation_code] || "Other";
    const gb = codeToGroup[b.occupation_code] || "Other";
    if (ga !== gb) return ga.localeCompare(gb);
    return (a.licensee_name || "").localeCompare(b.licensee_name || "");
  });

  for (const r of sorted) {
    const group = codeToGroup[r.occupation_code] || "Other";
    const trade = TRADE_MAP[r.occupation_code] || "Other";
    const address = [r.address1, r.address2, r.address3]
      .filter(Boolean)
      .join(" ");
    const county = COUNTY_NAMES[r.county_code] || r.county_code;

    rows.push(
      [
        group,
        trade,
        r.licensee_name,
        r.dba_name,
        r.license_number,
        r.class_code,
        address,
        r.city,
        r.state,
        r.zip,
        county,
        r.original_license_date,
        r.expiration_date,
        "New",
        "",
      ]
        .map(escapeCsv)
        .join(",")
    );
  }

  writeFileSync(filename, rows.join("\n"), "utf-8");
  console.log(`\nSaved to ${filename}`);
}

async function main() {
  const { values } = parseArgs({
    options: {
      output: { type: "string" },
    },
  });

  console.log("=======================================================");
  console.log("Capstone Custom Builds — DBPR License Scraper (Node)");
  console.log("=======================================================");

  // Download construction
  const constructionCsv = await downloadCsv(CONSTRUCTION_URL, "Construction");
  let constructionRecords = parseRecords(constructionCsv);
  console.log(`  Total construction records: ${constructionRecords.length}`);
  constructionRecords = filterTampaActive(constructionRecords);
  console.log(`  Active Tampa-area: ${constructionRecords.length}`);

  // Download electrical
  let allRecords = constructionRecords;
  try {
    const electricalCsv = await downloadCsv(ELECTRICAL_URL, "Electrical");
    let electricalRecords = parseRecords(electricalCsv);
    console.log(`  Total electrical records: ${electricalRecords.length}`);
    electricalRecords = filterTampaActive(electricalRecords);
    console.log(`  Active Tampa-area: ${electricalRecords.length}`);
    allRecords = [...constructionRecords, ...electricalRecords];
  } catch (e) {
    console.log(`  Warning: Could not download electrical data (${e.message})`);
    console.log("  Proceeding with construction data only.");
  }

  console.log(`\nTotal Tampa-area active licenses: ${allRecords.length}`);

  // Breakdown
  console.log("\nBreakdown by trade group:");
  for (const [group, codes] of Object.entries(TRADE_GROUPS)) {
    const codesSet = new Set(codes);
    const count = allRecords.filter((r) => codesSet.has(r.occupation_code)).length;
    if (count > 0) console.log(`  ${group}: ${count}`);
  }

  const filename = values.output || resolve(OUTPUT_DIR, "tampa_dbpr_contractors.csv");
  buildCsv(allRecords, filename);

  console.log("\nDone! This data is:");
  console.log("  - Free (public records, no API key needed)");
  console.log("  - State-verified license data");
  console.log("  - Includes license numbers, dates, and status");
  console.log("  - Updated weekly by DBPR");
  console.log("\nTip: Cross-reference with your Google Places data");
  console.log("     to match license numbers to phone/website/reviews.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});