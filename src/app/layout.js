import Layout from "@/Components/Layout";
import "./globals.css";
import Preloader from "@/Components/Preloader/Preloader";
import JsonLd from "@/Components/SEO/Jsonld";

const BASE_URL = "https://abbasvisuals.com";

export const metadata = {
  metadataBase: new URL(BASE_URL),

  // ── Primary ────────────────────────────────────────────────────────────
  title: {
    default: "ABBAS VISUALS",
    template: "ABBAS VISUALS",
  },
  description:
    "Abbas Visuals is an award-winning luxury photography and creative studio by Ahmed Abbas. Specialising in advertising, hospitality, automotive, fine-art, and F&B photography across Dubai, UAE, Saudi Arabia, and Egypt.",
  keywords: [
    "Abbas Visuals",
    "Ahmed Abbas photographer",
    "luxury photographer Dubai",
    "commercial photographer UAE",
    "advertising photography Dubai",
    "hospitality photography UAE",
    "automotive photography Dubai",
    "fine art photography",
    "creative studio Dubai",
    "brand photographer UAE",
    "Jumeirah photographer",
    "Adidas UAE photographer",
    "Puma Middle East photographer",
    "BMW photographer Dubai",
    "fashion photographer UAE",
    "food photography Dubai",
    "product photography UAE",
    "creative agency Dubai",
    "photographer Saudi Arabia",
    "photographer Egypt",
    "مصور دبي",
    "مصور إبداعي الإمارات",
    "The best photographer in Dubai",
    "The best photographer in UAE",
    "The best photographer in Saudi arabia",
    "Top photographer",
    "Award-winning photographer",
    "Commercial photographer",

  ],
  authors: [{ name: "Ahmed Abbas", url: BASE_URL }],
  creator: "Ahmed Abbas",
  publisher: "Abbas Visuals",
  category: "Photography & Creative Studio",

  // ── Canonical ──────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": BASE_URL,
      "ar-AE": `${BASE_URL}/ar`,
    },
  },

  // ── Open Graph ─────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Abbas Visuals",
    title: "ABBAS VISUALS",
    description:
      "Award-winning commercial & fine-art photography by Ahmed Abbas. We craft culturally-inspired, social-first visual content for global brands across the UAE, KSA, and beyond.",
    images: [
      {
        url: "/website-img.webp", 
        width: 1200,
        height: 630,
        alt: "Abbas Visuals Creative Studio Dubai",
        type: "image/jpeg",
      },
    ],
  },


  // ── Robots ─────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },


  // ── Icons ──────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
    ],
   
  },

  // ── Manifest / theme ───────────────────────────────────────────────────
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#000000" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect to external origins for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
       

        {/* Geo tags – helps local SEO for UAE / Middle East */}
        <meta name="geo.region" content="AE-DU" />
        <meta name="geo.placename" content="Dubai, United Arab Emirates" />
        <meta name="geo.position" content="25.2048;55.2708" />
        <meta name="ICBM" content="25.2048, 55.2708" />

        {/* Structured Data */}
        <JsonLd />
      </head>
      <body>
        <Preloader />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}