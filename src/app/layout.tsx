import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../lib/theme';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'DataVeda — Data Engineering Interview Prep, Practice & Free Masterclasses',
  description: 'Everything you need to become a job-ready Data Engineer. Learn the fundamentals, build real production projects with YouTube masterclasses, practice 850+ company-tagged problems, and read top engineering books in The Vault.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} theme-dark`}>
      <body className="antialiased bg-forge-bg text-forge-text min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
