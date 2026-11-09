import { ImageResponse } from "next/og";

export const alt =
  "MateRico: una ciudad que se construye con matemáticas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BARRIO_COLORS = [
  "#0F7B5F",
  "#2563EB",
  "#7C3AED",
  "#C2410C",
  "#BE185D",
  "#0E7490",
];

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFF8EC",
          padding: "64px",
          fontFamily: "sans-serif",
          color: "#1F2430",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              background: "#0F7B5F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 999,
                background: "#F2B705",
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 800 }}>
            <span>Mate</span>
            <span style={{ color: "#0F7B5F" }}>Rico</span>
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 8,
              borderRadius: 999,
              border: "2px solid #E7DCC8",
              padding: "8px 18px",
              fontSize: 22,
              fontWeight: 700,
              color: "#6B7280",
            }}
          >
            maqueta
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              maxWidth: 950,
            }}
          >
            Una ciudad que se construye con matemáticas.
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#4B5563" }}>
            6 barrios · 22 plantillas paramétricas · puntos de control
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {BARRIO_COLORS.map((color) => (
            <div
              key={color}
              style={{
                display: "flex",
                width: 54,
                height: 54,
                borderRadius: 16,
                background: color,
              }}
            />
          ))}
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              fontSize: 24,
              fontWeight: 700,
              color: "#6B4E00",
            }}
          >
            Investigación de Operaciones · 10.° y 11.°
          </div>
        </div>
      </div>
    ),
    size
  );
}
