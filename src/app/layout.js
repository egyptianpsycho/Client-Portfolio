import Layout from "@/Components/Layout";
import "./globals.css";
import Preloader from "@/Components/Preloader/Preloader";
import JsonLd from "@/Components/SEO/Jsonld";
import { GoogleAnalytics } from '@next/third-parties/google'
import { Bebas_Neue, Nanum_Myeongjo } from "next/font/google";

// Self-hosted by next/font: no render-blocking request chain to Google,
// and size-adjusted fallbacks so the swap doesn't shift layout (which also
// threw off every ScrollTrigger start/end measured before the swap).
//
// Work Sans is deliberately NOT loaded: the old Google Fonts @import that
// carried it was silently dropped by the build, so the live site has always
// rendered "Work Sans" text in the fallback sans-serif (Arial), and the
// layout (e.g. the About paragraph's line breaks) is tuned to that. To
// switch to real Work Sans, add Work_Sans here like the fonts below.
const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-nanum-myeongjo",
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas-neue",
});

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
        url: "/og-image.jpg",
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
    icon: [{ url: "/favicon.png", type: "image/png" }],
  },

};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${nanumMyeongjo.variable} ${bebasNeue.variable}`}
    >
      <head>
        {/* PP Neue Montreal (globals.css) and the Mux video thumbnails */}
        <link
          rel="preconnect"
          href="https://fonts.cdnfonts.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://image.mux.com" />

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
        <GoogleAnalytics gaId="G-JL1RFRMGP9" />
      </body>
    </html>
  );
}
