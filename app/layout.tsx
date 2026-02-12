import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Privacy-First Hotel Capture Measurement Plan",
  description:
    "Project plan map for privacy-first measurement of addressable market and hotel capture.",
  icons: {
    icon: [
      { url: "/site-assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/site-assets/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [{ url: "/site-assets/apple-touch-icon.png" }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
