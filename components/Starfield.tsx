// FILE: components/Starfield.tsx
'use client'

export default function Starfield() {
  const stars = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 7) % 100}%`,
    top: `${(i * 53 + 13) % 100}%`,
    size: 1 + (i % 2),
    delay: `${(i % 8) * 0.35}s`,
    duration: `${4 + (i % 6)}s`,
    bright: i % 5 === 0,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(34,211,238,0.05) 0%, transparent 60%)',
        }}
      />
      {stars.map(s => (
        <span
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: s.bright ? '#e5e9f0' : '#22d3ee',
            boxShadow: s.bright
              ? '0 0 6px rgba(229,233,240,0.7)'
              : '0 0 5px rgba(34,211,238,0.75)',
            animation: `starTwinkle ${s.duration} ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  )
}