import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Capstone Custom Builds — Custom Homes & Renovations in Tampa Bay, Florida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&display=swap`;
  const css = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    },
  }).then((res) => res.text());

  const match = css.match(/src: url\((.+?)\) format\(/);
  if (!match) throw new Error(`Could not load font: ${family}`);

  return fetch(match[1]).then((res) => res.arrayBuffer());
}

export default async function OGImage() {
  const [cormorantFont, interFont] = await Promise.all([
    loadGoogleFont("Cormorant Garamond", 300),
    loadGoogleFont("Inter", 400),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF8F5",
          position: "relative",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: "#B8977E",
          }}
        />

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* CAPSTONE ◆ on one line */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <span
              style={{
                fontFamily: "Cormorant Garamond",
                fontSize: 82,
                fontWeight: 300,
                color: "#1A1A1A",
                letterSpacing: "0.18em",
              }}
            >
              CAPSTONE
            </span>
            <span
              style={{
                fontSize: 44,
                color: "#B8977E",
                marginLeft: 4,
                marginTop: -8,
              }}
            >
              ◆
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontFamily: "Inter",
              fontSize: 20,
              fontWeight: 400,
              color: "#4A4A4A",
              letterSpacing: "0.25em",
              marginTop: 24,
            }}
          >
            {"CUSTOM BUILDS  |  RENOVATIONS"}
          </div>

          {/* Location */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontFamily: "Inter",
              fontSize: 16,
              fontWeight: 400,
              color: "#8A8A7A",
              letterSpacing: "0.15em",
              marginTop: 16,
            }}
          >
            Tampa, FL
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: "#B8977E",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cormorant Garamond",
          data: cormorantFont,
          weight: 300,
          style: "normal",
        },
        {
          name: "Inter",
          data: interFont,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
