import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "TratoDatos - Política de Datos para tu Empresa";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          backgroundImage:
            "linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f0fdf4 100%)",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(90deg, #2563eb, #7c3aed, #2563eb)",
          }}
        />

        {/* Logo and brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "24px",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#0f172a",
            }}
          >
            TratoDatos
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          <span
            style={{
              fontSize: "52px",
              fontWeight: "600",
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "24px",
            }}
          >
            Genera tu Política de Datos
          </span>
          <span
            style={{
              fontSize: "52px",
              fontWeight: "600",
              color: "#2563eb",
              lineHeight: 1.2,
            }}
          >
            en Minutos
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: "40px",
            fontSize: "28px",
            color: "#64748b",
            textAlign: "center",
          }}
        >
          Cumple con la Ley 21.719 de Chile • Sin abogados • Sin complicaciones
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#f0fdf4",
              padding: "12px 24px",
              borderRadius: "999px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span style={{ color: "#16a34a", fontWeight: "500" }}>
              Wizard de 12 pasos
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#eff6ff",
              padding: "12px 24px",
              borderRadius: "999px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span style={{ color: "#2563eb", fontWeight: "500" }}>
              PDF y Word
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#faf5ff",
              padding: "12px 24px",
              borderRadius: "999px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ color: "#7c3aed", fontWeight: "500" }}>
              30 minutos
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
