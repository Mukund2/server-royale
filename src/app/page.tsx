'use client';

import dynamic from 'next/dynamic';

const PhaserGame = dynamic(() => import('@/components/PhaserGame'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: 430,
      height: 760,
      backgroundColor: '#0a0a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#00ff88',
      fontSize: 18,
      fontFamily: 'monospace',
    }}>
      Loading Server Royale...
    </div>
  ),
});

export default function Home() {
  return <PhaserGame />;
}
