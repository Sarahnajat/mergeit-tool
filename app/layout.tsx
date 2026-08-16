import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ToastProvider } from "@/components/AlertMessage";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://mergeittool.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL("https://mergeittool.vercel.app" ),

  title: {
    default: "MergeIt — SRT & ASS Subtitle Tools",
    template: "%s | MergeIt",
  },

  description:
    "Split, merge, and convert SRT and ASS subtitle files directly in your browser. Fast, private, and easy to use.",
    keywords: [
      "MergeIt",
      "subtitle tools",
      "SRT",
      "ASS",
      "split subtitles",
      "merge subtitles",
      "convert subtitles",
      "subtitle editor",
      "subtitle converter",
      "online subtitle tool",
    ],
  alternates: {
    canonical: "https://mergeittool.vercel.app/",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/icon.svg",
  },

  openGraph: {
    type: "website",
    url: "https://mergeittool.vercel.app/",
    siteName: "MergeIt",
    locale: "en_US",
    title: "MergeIt — SRT & ASS Subtitle Tools",
    description:
      "Split, merge, and convert SRT and ASS subtitle files directly in your browser.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MergeIt subtitle tools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "MergeIt — SRT & ASS Subtitle Tools",
    description:
      "Split, merge, and convert SRT and ASS subtitle files directly in your browser.",
    images: ["/og-image.png"],
  },
};


export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>{children}</ToastProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}