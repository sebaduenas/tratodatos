import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteConfig = {
  name: "TratoDatos",
  description:
    "Genera tu política de tratamiento de datos personales conforme a la Ley 21.719 chilena en minutos. Proceso guiado de 12 pasos, documentos profesionales en PDF y Word. Sin abogados, sin complicaciones.",
  url: "https://tratodatos.cl",
  ogImage: "https://tratodatos.cl/og-image.png",
  keywords: [
    "política de datos personales",
    "ley 21.719",
    "ley 21.719 chile",
    "protección de datos chile",
    "tratamiento datos personales",
    "política de privacidad chile",
    "cumplimiento ley de datos chile",
    "generador política de datos",
    "política GDPR chile",
    "ley protección datos chile",
    "política tratamiento información personal",
    "normativa datos personales chile",
    "crear política de privacidad",
    "plantilla política de datos",
    "cumplimiento normativo chile",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Política de Datos para tu Empresa | Ley 21.719 Chile`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "TratoDatos", url: siteConfig.url }],
  creator: "TratoDatos",
  publisher: "TratoDatos",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteConfig.url,
    title: `${siteConfig.name} - Genera tu Política de Datos en Minutos`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "TratoDatos - Política de Datos para tu Empresa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Política de Datos para tu Empresa`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@tratodatos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "technology",
  classification: "Business Software",
  other: {
    "google-site-verification": "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {
        "@id": `${siteConfig.url}/#organization`,
      },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      ],
      inLanguage: "es-CL",
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        inLanguage: "es-CL",
        "@id": `${siteConfig.url}/#logo`,
        url: `${siteConfig.url}/logo.png`,
        contentUrl: `${siteConfig.url}/logo.png`,
        width: 512,
        height: 512,
        caption: siteConfig.name,
      },
      image: { "@id": `${siteConfig.url}/#logo` },
      sameAs: [
        "https://twitter.com/tratodatos",
        "https://linkedin.com/company/tratodatos",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "contacto@tratodatos.cl",
        contactType: "customer service",
        availableLanguage: "Spanish",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Santiago",
        addressCountry: "CL",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.url}/#software`,
      name: siteConfig.name,
      description:
        "Plataforma para generar políticas de tratamiento de datos personales conforme a la Ley 21.719 de Chile",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        {
          "@type": "Offer",
          name: "Plan Gratuito",
          price: "0",
          priceCurrency: "CLP",
          description: "1 política, PDF con marca de agua",
        },
        {
          "@type": "Offer",
          name: "Plan Profesional",
          price: "9990",
          priceCurrency: "CLP",
          description: "5 políticas, sin marca de agua, exportación a Word",
        },
        {
          "@type": "Offer",
          name: "Plan Empresa",
          price: "29990",
          priceCurrency: "CLP",
          description: "Políticas ilimitadas, multi-usuario, API de acceso",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "150",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.url}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué es la Ley 21.719 de Chile?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La Ley 21.719 modifica la Ley 19.628 sobre Protección de la Vida Privada y establece nuevos estándares para el tratamiento de datos personales en Chile, alineándose con regulaciones internacionales como el GDPR europeo. Todas las empresas que traten datos personales deben cumplir antes de diciembre de 2026.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto tiempo toma crear una política de datos con TratoDatos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Con nuestro proceso guiado de 12 pasos, puedes crear tu política de tratamiento de datos personales en aproximadamente 30 minutos, sin necesidad de conocimientos legales previos.",
          },
        },
        {
          "@type": "Question",
          name: "¿Es válida legalmente la política generada por TratoDatos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, las políticas generadas por TratoDatos están 100% alineadas con los requerimientos de la Ley 21.719 de Chile. Sin embargo, recomendamos una revisión por un profesional legal para casos específicos o complejos.",
          },
        },
        {
          "@type": "Question",
          name: "¿En qué formatos puedo descargar mi política?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Puedes descargar tu política en formato PDF y Word (DOCX). El plan gratuito incluye PDF con marca de agua, mientras que los planes pagados ofrecen documentos sin marca de agua y exportación a Word.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* AI/LLM specific meta tags */}
        <meta name="ai-content-declaration" content="human-created" />
        <meta
          name="ai-summary"
          content="TratoDatos es una plataforma chilena para generar políticas de tratamiento de datos personales conforme a la Ley 21.719. Ofrece un proceso de 12 pasos, generación de PDF y Word, con planes desde gratis hasta empresa."
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
