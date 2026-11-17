import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'ShubhVivah | Premium Indian Wedding Invitation Platform',
  description:
    'Create stunning, culturally authentic Indian wedding invitations. Multi-event scheduling, family blessings, interactive guest personalization, 1-tap WhatsApp sharing, and instant RSVP tracking.',
  keywords: [
    'Indian wedding invitation',
    'digital wedding card',
    'shaadi card online',
    'marriage invitation maker',
    'royal rajasthani wedding invite',
    'south indian wedding invitation',
    'muslim nikah invite',
    'punjabi wedding card',
  ],
  authors: [{ name: 'ShubhVivah Tech' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪔</text></svg>" />
      </head>
      <body className="min-h-screen bg-[#FFF9F0] text-[#2A1810] antialiased selection:bg-[#C9A44C] selection:text-white">
        {children}
      </body>
    </html>
  );
}
