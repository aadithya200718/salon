import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'BEAUTI BOX — Your beauty, our passion.', description: 'Explore a new beauty experience. A website concept for BEAUTI BOX beauty studio.', robots: { index: false, follow: false }, icons: { icon: '/images/beauti-box-logo.png' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
