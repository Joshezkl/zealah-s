import { useMemo, type CSSProperties } from 'react'

export function OceanEffects({ dense = false }: { dense?: boolean }) {
  const bubbles = useMemo(
    () => Array.from({ length: dense ? 18 : 10 }, (_, index) => ({
      id: index,
      left: `${(index * 37 + 7) % 96}%`,
      size: 7 + (index * 11) % 24,
      delay: (index * 0.7) % 8,
      duration: 9 + (index % 5),
    })),
    [dense],
  )
  const fish = useMemo(
    () => Array.from({ length: dense ? 5 : 3 }, (_, index) => ({
      id: index,
      top: `${17 + (index * 23) % 66}%`,
      size: 25 + (index * 9) % 19,
      delay: index * -5.7,
      duration: 24 + (index * 7) % 13,
      direction: index % 3 === 1 ? 'left' : 'right',
      color: ['#ffb8d1', '#a8f3ed', '#e7c7ff', '#ffe4a8', '#b5dbff'][index],
    })),
    [dense],
  )
  return (
    <div className="ocean-effects" aria-hidden="true">
      <div className="light-rays" />
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="bubble"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
          }}
        />
      ))}
      {fish.map((swimmer) => (
        <span
          key={swimmer.id}
          className={`ocean-fish fish-${swimmer.direction}`}
          style={{
            top: swimmer.top,
            width: swimmer.size,
            animationDelay: `${swimmer.delay}s`,
            animationDuration: `${swimmer.duration}s`,
            '--fish-color': swimmer.color,
          } as CSSProperties}
        >
          <svg viewBox="0 0 100 50" role="presentation">
            <path className="fish-tail" d="M68 25 94 7 90 25 94 43Z" />
            <path className="fish-body" d="M8 25C21 7 51 5 72 25 51 45 21 43 8 25Z" />
            <path className="fish-fin" d="m39 12 11-9 10 12m-20 23 11 9 10-12" />
            <circle className="fish-eye" cx="21" cy="22" r="2" />
            <circle className="fish-glint" cx="20.5" cy="21.5" r=".7" />
          </svg>
        </span>
      ))}
      <span className="sparkle sparkle-one">✦</span>
      <span className="sparkle sparkle-two">✧</span>
      <span className="sparkle sparkle-three">✦</span>
    </div>
  )
}
