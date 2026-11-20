import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FoodAI Kitchen — Kitchen Display System',
  description: 'Live order queue and ticket management for kitchen staff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0a] text-white`}>
        {children}
        <Toaster richColors position="top-right" theme="dark" />
      </body>
    </html>
  );
}
