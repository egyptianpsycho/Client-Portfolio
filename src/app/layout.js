import Layout from "@/Components/Layout";
import "./globals.css";
import Preloader from "@/Components/Preloader/Preloader";

export const metadata = {
  title: "ABBAS VISUALS",
  description: "Passionate & Creative Photographer",
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
