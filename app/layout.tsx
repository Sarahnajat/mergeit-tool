import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ToastProvider } from "@/components/AlertMessage";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata = {
  title: {
    default: "MergeIt",
    template: "%s | MergeIt",
  },
  description: "Professional subtitle management reimagined.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "MergeIt – Subtitle Management Tool",
    description: "Split, merge, and convert SRT and ASS subtitle files directly in your browser.",
    url: "https://mergeit.com",
    siteName: "MergeIt",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MergeIt preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MergeIt",
    description: "Professional subtitle management, reimagined for speed and accuracy—convert, split, and merge files seamlessly in your browser.",
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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}