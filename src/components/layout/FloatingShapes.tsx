'use client';

export function FloatingShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Coral shape */}
      <div
        className="absolute h-32 w-32 rounded-full bg-coral/15"
        style={{
          top: '10%',
          left: '5%',
          animation: 'float 8s ease-in-out infinite',
        }}
      />

      {/* Yellow shape */}
      <div
        className="absolute h-24 w-24 rounded-full bg-yellow/20"
        style={{
          top: '60%',
          left: '10%',
          animation: 'float 10s ease-in-out infinite 1s',
        }}
      />

      {/* Sage shape */}
      <div
        className="absolute h-40 w-40 rounded-full bg-sage/15"
        style={{
          top: '20%',
          right: '8%',
          animation: 'float 12s ease-in-out infinite 2s',
        }}
      />

      {/* Sky shape */}
      <div
        className="absolute h-28 w-28 rounded-full bg-sky/20"
        style={{
          top: '70%',
          right: '15%',
          animation: 'float 9s ease-in-out infinite 0.5s',
        }}
      />

      {/* Small coral accent */}
      <div
        className="absolute h-16 w-16 rounded-full bg-coral/10"
        style={{
          top: '40%',
          left: '50%',
          animation: 'float 7s ease-in-out infinite 3s',
        }}
      />
    </div>
  );
}
