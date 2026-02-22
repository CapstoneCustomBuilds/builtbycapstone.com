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

// Output directly to app/ so Next.js auto-discovers it
const OUTPUT_PATH = path.join(__dirname, "..", "app", "opengraph-image.png");

const prompt = `Create a minimal, elegant open graph image at exactly 1200x630 pixels.

Background: warm cream color (#FAF8F5).
Thin horizontal gold line (#B8977E) across the very top edge (4px tall).
Thin horizontal gold line (#B8977E) across the very bottom edge (4px tall).

Centered in the middle of the image, vertically and horizontally:
- "CAPSTONE ◆" all on ONE line — the word "CAPSTONE" in large, thin/light (300 weight) Cormorant Garamond serif font with wide letter spacing, dark charcoal (#1A1A1A), followed by a small gold diamond ◆ in (#B8977E) vertically centered with the text on the same baseline. The diamond is just a small accent to the right of the word, vertically middle-aligned.
- Below that, "CUSTOM HOMES & RENOVATIONS" in small uppercase sans-serif font, muted gray (#4A4A4A), with wide letter spacing.
- Below that, "Tampa Bay, Florida" in even smaller, lighter gray text (#8A8A7A).

Style: Clean, editorial, luxury brand aesthetic. No photos, no icons, no gradients, just elegant typography on a warm cream background. The design should feel like a high-end architecture firm's branding. Crisp and sharp text rendering.`;

async function main() {
  if (fs.existsSync(OUTPUT_PATH)) {
    console.log("OG image already exists. Delete it first to regenerate.");
    console.log(`  ${OUTPUT_PATH}`);
    process.exit(0);
  }

  console.log("Generating OG image for Capstone Custom Builds...\n");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed to generate OG image: ${res.status} ${text}`);
    process.exit(1);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p) => p.inlineData);

  if (!imagePart) {
    console.error("No image data returned from Gemini");
    process.exit(1);
  }

  const buffer = Buffer.from(imagePart.inlineData.data, "base64");
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Saved OG image (${(buffer.length / 1024).toFixed(0)} KB)`);
  console.log(`  ${OUTPUT_PATH}`);
  console.log("\nNext.js will auto-discover app/opengraph-image.png — no config needed.");
}

main().catch(console.error);
