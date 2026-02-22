import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = val;
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env.local");
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, "..", "public", "images");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const images = [
  {
    filename: "hero-exterior.jpg",
    prompt:
      "Professional architectural photograph of a luxury modern custom-built home exterior in Tampa, Florida. Golden hour lighting, wide 16:9 composition, palm trees, clean contemporary lines, warm tones, real estate photography style. No text or watermarks.",
  },
  {
    filename: "service-custom-homes.jpg",
    prompt:
      "Professional interior photograph of a luxury custom home, open floor plan with high ceilings, natural light streaming through large windows, warm neutral tones, modern furniture, Tampa Florida style. Real estate photography. No text or watermarks.",
  },
  {
    filename: "service-renovations.jpg",
    prompt:
      "Professional photograph of a modern kitchen renovation, white marble waterfall island, brass pendant lights, warm wood accents, clean contemporary design, bright and airy. Real estate photography style. No text or watermarks.",
  },
  {
    filename: "about-tampa.jpg",
    prompt:
      "Professional landscape photograph of Tampa Bay coastal sunrise, palm tree silhouettes against warm golden sky, calm water reflections, atmospheric and serene, wide composition. No text or watermarks.",
  },
  {
    filename: "vision-1.jpg",
    prompt:
      "Professional architectural detail photograph, modern floating staircase with glass railings, warm wood treads, dramatic natural light, editorial feel, minimalist luxury interior. No text or watermarks.",
  },
  {
    filename: "vision-2.jpg",
    prompt:
      "Professional architectural detail photograph in portrait orientation, tall vertical composition. Luxury modern bathroom with freestanding soaking tub, floor-to-ceiling marble walls, brass fixtures, natural light from a tall window, warm neutral tones, editorial interior photography. No text or watermarks.",
  },
  {
    filename: "vision-3.jpg",
    prompt:
      "Professional photograph of modern luxury landscaping and hardscape design, clean geometric stone pathways, architectural concrete planters, outdoor gas fireplace, lush tropical plants, evening lighting, high-end residential, wide cinematic composition. No text or watermarks.",
  },
  {
    filename: "vision-4.jpg",
    prompt:
      "Professional photograph of luxury outdoor living space at dusk, modern infinity pool overlooking water, contemporary lanai with comfortable seating, warm ambient lighting, palm trees, tropical luxury residential, wide cinematic composition. No text or watermarks.",
  },
  {
    filename: "vision-5.jpg",
    prompt:
      "Professional aerial drone photograph looking down at a completed modern luxury home with pool, manicured yard, clean architectural lines, tropical landscaping, warm golden hour lighting, bird's eye view, wide cinematic composition. No text or watermarks.",
  },
  {
    filename: "vision-6.jpg",
    prompt:
      "Professional photograph of a modern luxury home exterior at twilight blue hour, house glowing warmly from interior lights, contemporary architecture, clean lines, palm trees, dramatic sky, moody atmospheric residential photography. No text or watermarks.",
  },
  {
    filename: "vision-heli.jpg",
    prompt:
      "Professional aerial helicopter photograph over Tampa Bay waterfront, luxury waterfront homes along the shoreline, boats in the marina, turquoise water, palm-lined streets, golden hour lighting, sweeping wide cinematic panoramic composition, real estate aerial photography. No text or watermarks.",
  },
];

async function generateImage(image) {
  const outputPath = path.join(OUTPUT_DIR, image.filename);
  if (fs.existsSync(outputPath)) {
    console.log(`  Skipping ${image.filename} (already exists)`);
    return;
  }

  console.log(`  Generating ${image.filename}...`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: image.prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`  Failed to generate ${image.filename}: ${res.status} ${text}`);
    return;
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart) {
    console.error(`  No image data returned for ${image.filename}`);
    return;
  }

  const buffer = Buffer.from(imagePart.inlineData.data, "base64");
  fs.writeFileSync(outputPath, buffer);
  console.log(`  Saved ${image.filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

async function main() {
  console.log("Generating images for Capstone Custom Builds...\n");
  for (const image of images) {
    await generateImage(image);
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.log("\nDone!");
}

main().catch(console.error);
