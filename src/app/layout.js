import Layout from "@/Components/Layout";
import "./globals.css";

export const metadata = {
  title: "Abbas Portfolio",
  description: "Passionate & Creative Photographer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
