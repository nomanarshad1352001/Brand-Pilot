import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BrandPilot — Amazon Wholesale CRM",
    template: "%s | BrandPilot",
  },
  description: "A purpose-built CRM for Amazon wholesale sellers to manage brand prospecting, outreach, applications, pricing, approvals, follow-ups, and KPIs.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
