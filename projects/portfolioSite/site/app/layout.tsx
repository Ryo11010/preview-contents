import type { Metadata } from 'next';
import './globals.css';
import { siteMetadata } from '@/config/site';

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  metadataBase: siteMetadata.metadataBase,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: siteMetadata.ogImage,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="font-sans">
      <body>{children}</body>
    </html>
  );
}
