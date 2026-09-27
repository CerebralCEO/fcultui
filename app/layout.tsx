import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchModal from "@/components/SearchModal";
import SmoothScroll from "@/components/SmoothScroll";
import { InlineScript } from "@/components/InlineScript";
import { site } from "@/lib/site";

// Same file the original ships: Inter 5.3.0, latin, variable weight (enables the 510 heading weight)
const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${site.name} – ${site.tagline}`,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

// Runs before paint: restores the saved theme and flags JS so reveal targets start hidden (no flash)
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');if(JSON.parse(localStorage.getItem('mg-theme'))==='light')d.classList.add('light')}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <InlineScript html={bootScript} />
      </head>
      <body>
        <Providers>
          <SmoothScroll />
          <div id="wrapper">
            <Header />
            {children}
            <Footer />
          </div>
          <SearchModal />
        </Providers>
      </body>
    </html>
  );
}
