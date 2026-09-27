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
import { ClerkProvider } from "@clerk/nextjs";
import AuthProvider from "@/components/auth/AuthProvider";
import { authEnabled } from "@/lib/auth-config";
import { getScreens } from "@/lib/content";

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

// Runs before paint: restores theme + framework preference and flags JS so reveal targets start hidden (no flash)
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');if(JSON.parse(localStorage.getItem('mg-theme'))==='light')d.classList.add('light');if(JSON.parse(localStorage.getItem('mg-framework'))==='rn')d.dataset.fw='rn'}catch(e){}})();`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const screens = await getScreens();
  const app = (
    <Providers>
      <AuthProvider enabled={authEnabled}>
        <SmoothScroll />
        <div id="wrapper">
          <Header />
          {children}
          <Footer />
        </div>
        <SearchModal screens={screens} />
      </AuthProvider>
    </Providers>
  );

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <InlineScript html={bootScript} />
      </head>
      <body>
        {/* Clerk only mounts when keys exist, so the site keeps running before auth is configured */}
        {authEnabled ? <ClerkProvider>{app}</ClerkProvider> : app}
      </body>
    </html>
  );
}
