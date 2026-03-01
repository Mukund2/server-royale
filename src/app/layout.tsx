import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Server Royale',
  description: 'Clash Royale-style tower defense in a data center. Defend your servers against AI-powered chaos!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#0a0a1a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        {children}
      </body>
    </html>
  );
}
