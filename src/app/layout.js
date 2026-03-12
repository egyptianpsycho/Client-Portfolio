import Layout from "@/Components/Layout";
import "./globals.css";
import Preloader from "@/Components/Preloader/Preloader";

export const metadata = {
  title: "ABBAS VISUALS",
  description:
    "Abbas Visuals is a creative photography studio by Ahmed Abbas specializing in creative photography, brand visuals, and modern visual storytelling.",
  keywords: [
    "Ahmed Abbas",
    "Creative Photographer",
    "Creative Agency",
    "Creative Studio",
    "Abbas Visuals",
    "Abbas Visuals Studio",
    "Abbas Visuals Creative Studio",
    "Abbas Visuals Creative Agency",
    "Egyptian Photographer",
    "Dubai Photography",
  ],
  icons: {
    icon: "/favicon.png",
  },
  authors: [{ name: "Ahmed Abbas" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Preloader />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
