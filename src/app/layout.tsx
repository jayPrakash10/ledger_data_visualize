import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "@/styles/globals.css";
import { AppShell } from "@/components/layout/AppShell";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Ledger – Personal expense analyzer", template: "%s · Ledger" },
  description: "See where your money goes each month, by category. Demo with mock data.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/** Applies the saved (or system) theme before first paint to avoid a flash. */
const themeScript = `(function(){try{var t=localStorage.getItem('ledger:theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
