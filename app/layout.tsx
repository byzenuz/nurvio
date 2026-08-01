import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AudioPlayer from "@/components/AudioPlayer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AudioProvider } from "@/contexts/AudioContext";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans', display: 'swap' });
const amiri = Amiri({ subsets: ["arabic"], variable: '--font-arabic', weight: ['400', '700'], display: 'swap' });

export const metadata: Metadata = {
  title: "Nurvia - Musulmon uchun kerakli barcha narsalar",
  description: "Musulmon uchun kerakli barcha narsalar bitta joyda. Namoz vaqtlari, Qur'on, Duolar, Qibla, Tasbeh.",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark">
      <body className={`${inter.variable} ${amiri.variable} font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <AudioProvider>
          <LanguageProvider>
            {children}
            <BottomNav />
            <AudioPlayer />
          </LanguageProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
