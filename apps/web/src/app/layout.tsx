import type { Metadata } from 'next';
import './globals.css';
import { SiteFooter } from '../components/layout/site-footer';
import { SiteHeader } from '../components/layout/site-header';

export const metadata: Metadata = {
  title: 'LGU Research Portal',
  description:
    'Lahore Garrison University research portal for researchers, publications, projects, groups, departments, theses, and academic discovery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-grid bg-[size:34px_34px] opacity-[0.08]" />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
