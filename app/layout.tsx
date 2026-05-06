import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Renovatiebedrijf | DRO Renovaties",
  description:
    "DRO Renovaties helpt huiseigenaren met duidelijke afspraken, strakke planning en professionele uitvoering van renovaties."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
