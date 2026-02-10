import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Ормон Хан | Великий объединитель',
  description: 'Биография и наследие Ормон Хана Ниязбек уулу — первого хана Кыргызского ханства XIX века.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
