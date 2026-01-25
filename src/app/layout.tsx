import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TratoDatos - Política de Datos para tu Empresa | Ley 21.719",
  description:
    "Genera tu política de tratamiento de datos personales conforme a la Ley 21.719 chilena. Wizard guiado de 12 pasos, documentos profesionales en PDF y Word.",
  keywords: [
    "política de datos",
    "ley 21.719",
    "protección de datos chile",
    "tratamiento datos personales",
    "cumplimiento GDPR",
    "política privacidad",
  ],
  authors: [{ name: "TratoDatos" }],
  openGraph: {
    title: "TratoDatos - Política de Datos para tu Empresa",
    description:
      "Genera tu política de tratamiento de datos conforme a la Ley 21.719",
    url: "https://tratodatos.cl",
    siteName: "TratoDatos",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
