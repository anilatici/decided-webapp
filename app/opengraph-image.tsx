import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #111111 0%, #1c1c19 55%, #2a2a23 100%)',
          color: '#f0efe8',
          padding: '64px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: 28,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#e1ff66',
          }}
        >
          <span>Decided</span>
          <span style={{ color: '#f0efe8' }}>Decision support for action</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, fontWeight: 800, lineHeight: 0.92 }}>
            <span>Move from overthinking</span>
            <span>to the next call.</span>
          </div>
          <div style={{ maxWidth: 900, fontSize: 34, lineHeight: 1.3, color: '#d0cec4' }}>
            Guided decision flows, saved outcomes, and cross-device continuity for the moments that matter.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
