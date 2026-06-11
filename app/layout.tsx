import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indian IT Sector Intelligence Hub | Institutional Research Platform",
  description: "Institutional-grade intelligence platform for Indian IT sector — TCS, Infosys, Wipro, HCLTech, Tech Mahindra, LTIMindtree, Mphasis, Persistent, Coforge, Zensar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
