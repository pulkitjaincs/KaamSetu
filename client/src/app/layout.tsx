import { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: "SkillAnchor | Better Jobs, Faster",
    template: "%s | SkillAnchor",
  },
  description: "SkillAnchor - The modern job platform for skilled workers and employers.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className={`${inter.className}`}>
        <div className="flex flex-col" style={{ minHeight: "100vh", backgroundColor: "var(--bg-body)" }}>
          <Providers>
            <Navbar />
            <main className="grow pb-[80px] lg:pb-0" style={{ paddingTop: '88px' }}>
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
          </Providers>
        </div>
      </body>
    </html>
  );
}
