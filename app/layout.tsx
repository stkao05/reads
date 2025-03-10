import "./globals.css";
import type { Metadata } from "next";
import { StrictMode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "島嶼書店指南",
  metadataBase: new URL("https://reads.tw"),
  description: "一本私藏的台灣獨立書店筆記",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StrictMode>
      <html lang="zh-TW">
        <body>
          <TooltipProvider>{children}</TooltipProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </StrictMode>
  );
}
