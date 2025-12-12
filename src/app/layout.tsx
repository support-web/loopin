import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Loopin - AI事業開発パートナー',
  description: 'AIと対話しながら、あなたの事業アイデアを具体化。事業計画書を自動生成します。',
  keywords: ['事業計画', 'AI', 'スタートアップ', '起業', '壁打ち'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
