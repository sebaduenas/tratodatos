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
          backgroundColor: "#2563eb",
        }}
      >
        {/* Logo and brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "24px",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "32px",
            }}
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "white",
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
            padding: "0 100px",
          }}
        >
          <span
            style={{
              fontSize: "48px",
              fontWeight: "600",
              color: "white",
              lineHeight: 1.3,
            }}
          >
            Genera tu Política de Datos Personales
          </span>
          <span
            style={{
              fontSize: "48px",
              fontWeight: "600",
              color: "#bfdbfe",
              lineHeight: 1.3,
            }}
          >
            conforme a la Ley 21.719 🇨🇱
          </span>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: "48px",
            backgroundColor: "white",
            padding: "20px 48px",
            borderRadius: "999px",
            fontSize: "28px",
            fontWeight: "600",
            color: "#2563eb",
          }}
        >
          Comienza gratis en tratodatos.cl
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
