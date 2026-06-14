import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vario - Enterprise E-Commerce",
  description: "Phase 1 of Vario Enterprise Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Mentor Note: 
            We inject the Client Component providers here. 
            Because the providers accept `children` as a prop, Next.js knows that 
            everything passed into `children` (our Server-rendered pages) can remain Server Components. 
            This is the architectural secret to mixing Client state managers (Redux/Query) 
            with Next.js App Router's default Server-Side Rendering! 
        */}
        <ReduxProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
