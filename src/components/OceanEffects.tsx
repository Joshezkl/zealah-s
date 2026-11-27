import { useEffect, useMemo, useRef, type CSSProperties } from 'react'

export function OceanEffects({ dense = false }: { dense?: boolean }) {
  const effectsRef = useRef<HTMLDivElement>(null)
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
  const turtles = useMemo(
    () => Array.from({ length: dense ? 3 : 2 }, (_, index) => ({
      id: index,
      top: `${dense ? 23 + index * 25 : 31 + index * 38}%`,
      size: (dense ? 46 : 42) + index * 8,
      delay: index * -7.5,
      duration: 42 + (index % 3) * 9,
      direction: index % 2 === 0 ? 'right' : 'left',
      color: ['#b8e3c9', '#c3d9d5', '#d5c6e8'][index],
    })),
    [dense],
  )
  const jellyfish = useMemo(
    () => Array.from({ length: dense ? 3 : 2 }, (_, index) => ({
      id: index,
      left: `${dense ? [14, 74, 47][index] : [21, 72][index]}%`,
      top: `${dense ? 19 + index * 27 : 26 + index * 34}%`,
      size: (dense ? 43 : 39) + index * 9,
      delay: index * -4.6,
      duration: 15 + index * 4,
      color: ['#f3c6ec', '#b9edf0', '#d8ccff'][index],
    })),
    [dense],
  )
  const pearls = useMemo(
    () => Array.from({ length: dense ? 7 : 4 }, (_, index) => ({
      id: index,
      left: `${6 + Math.random() * 88}%`,
      top: `${10 + Math.random() * 78}%`,
      size: 5 + Math.random() * 7,
      delay: -Math.random() * 14,
      duration: 12 + Math.random() * 10,
    })),
    [dense],
  )
  const randomStars = useMemo(
    () => Array.from({ length: dense ? 8 : 5 }, (_, index) => ({
      id: index,
      left: `${5 + Math.random() * 90}%`,
      top: `${8 + Math.random() * 80}%`,
      size: 5 + Math.random() * 9,
      delay: -Math.random() * 5,
      duration: 2.8 + Math.random() * 3.2,
      symbol: index % 2 === 0 ? '✦' : '✧',
    })),
    [dense],
  )
  const fishSchools = useMemo(
    () => Array.from({ length: dense ? 2 : 1 }, (_, index) => ({
      id: index,
      top: `${dense ? 30 + index * 36 : 36 + index * 28}%`,
      size: 88 + index * 16,
      delay: -Math.random() * 24,
      duration: 34 + index * 8,
      direction: index % 2 === 0 ? 'right' : 'left',
      color: ['#c5f5ec', '#ffe1ba'][index],
    })),
    [dense],
  )
  const dolphins = useMemo(() => {
    const duration = 48 + Math.random() * 12
    return [{
      id: 0,
      top: `${28 + Math.random() * 23}%`,
      size: 72 + Math.random() * 24,
      duration,
      delay: -((Date.now() / 1000) % duration),
    }]
  }, [dense])
  const crabs = useMemo(() => {
    const duration = 48 + Math.random() * 12
    return [{
      id: 0,
      size: dense ? 31 : 27,
      duration,
      delay: -((Date.now() / 1000) % duration),
    }]
  }, [dense])

  useEffect(() => {
    const effects = effectsRef.current
    if (!effects) return

    let frame = 0
    let pointerX = 0
    let pointerY = 0
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const bounds = effects.getBoundingClientRect()
      pointerX = event.clientX - bounds.left
      pointerY = event.clientY - bounds.top
      if (frame) return

      frame = requestAnimationFrame(() => {
        frame = 0
        effects.querySelectorAll<HTMLElement>('.bubble').forEach((bubble) => {
          const dx = Math.max(-14, Math.min(14, (pointerX - bubble.offsetLeft - bubble.offsetWidth / 2) * 0.035))
          const dy = Math.max(-12, Math.min(12, (pointerY - bubble.offsetTop - bubble.offsetHeight / 2) * 0.035))
          bubble.style.setProperty('--cursor-shift-x', `${dx}px`)
          bubble.style.setProperty('--cursor-shift-y', `${dy}px`)
        })
      })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={effectsRef} className="ocean-effects" aria-hidden="true">
      <div className="light-rays" />
      <div className="watery-shimmer" />
      <div className="ocean-current" />
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
      {pearls.map((pearl) => (
        <span
          key={pearl.id}
          className="floating-pearl"
          style={{
            left: pearl.left,
            top: pearl.top,
            width: pearl.size,
            height: pearl.size,
            animationDelay: `${pearl.delay}s`,
            animationDuration: `${pearl.duration}s`,
          }}
        />
      ))}
      {turtles.map((turtle) => (
        <span
          key={turtle.id}
          className={`ocean-turtle turtle-swim-${turtle.direction}`}
          style={{
            top: turtle.top,
            width: turtle.size,
            animationDelay: `${turtle.delay}s`,
            animationDuration: `${turtle.duration}s`,
            '--turtle-color': turtle.color,
          } as CSSProperties}
        >
          <svg className={turtle.direction === 'left' ? 'turtle-art turtle-art-left' : 'turtle-art'} viewBox="0 0 100 80" role="presentation">
            <g className="turtle-body">
              <g className="turtle-flipper turtle-back-upper"><path d="M38 31C28 20 19 18 14 23 15 31 23 37 38 40Z" /></g>
              <g className="turtle-flipper turtle-back-lower"><path d="M38 49C27 58 20 64 15 59 16 51 24 45 39 42Z" /></g>
              <path className="turtle-tail" d="m27 38-11-3 5 7-5 6 12-2Z" />
              <path className="turtle-shell" d="M25 40C25 24 36 15 50 15s25 9 25 25-11 25-25 25S25 56 25 40Z" />
              <path className="turtle-shell-seam" d="M50 16v48M27 33c11 5 35 5 46 0M27 48c11-5 35-5 46 0" />
              <circle className="turtle-head" cx="82" cy="40" r="10" />
              <circle className="turtle-eye" cx="85" cy="37" r="1.5" />
              <circle className="turtle-eye-glint" cx="85.5" cy="36.5" r=".55" />
              <g className="turtle-flipper turtle-front-upper"><path d="M59 30C66 18 77 10 84 15 85 23 76 33 62 39Z" /></g>
              <g className="turtle-flipper turtle-front-lower"><path d="M59 50C67 62 77 70 84 65 84 57 76 47 62 41Z" /></g>
            </g>
          </svg>
        </span>
      ))}
      {jellyfish.map((jelly) => (
        <span
          key={jelly.id}
          className="ocean-jellyfish"
          style={{
            left: jelly.left,
            top: jelly.top,
            width: jelly.size,
            animationDelay: `${jelly.delay}s`,
            animationDuration: `${jelly.duration}s`,
            '--jelly-color': jelly.color,
          } as CSSProperties}
        >
          <svg viewBox="0 0 100 132" role="presentation">
            <path className="jelly-cap" d="M9 55C10 30 26 12 50 10c24 2 40 20 41 45-11 7-22 8-31 1-7 7-13 7-20 0-10 7-21 6-31-1Z" />
            <path className="jelly-rim" d="M10 55c11 7 21 8 30 1 7 7 13 7 20 0 9 7 20 6 30-1" />
            <ellipse className="jelly-core" cx="50" cy="34" rx="13" ry="17" />
            <path className="jelly-tentacle jelly-tentacle-one" d="M27 59c-8 12 4 18-3 29s4 16-3 28" />
            <path className="jelly-tentacle jelly-tentacle-two" d="M41 61c-5 11 5 18 0 28s4 17-1 27" />
            <path className="jelly-tentacle jelly-tentacle-three" d="M57 61c5 11-5 18 0 28s-4 17 1 27" />
            <path className="jelly-tentacle jelly-tentacle-four" d="M72 59c8 12-4 18 3 29s-4 16 3 28" />
          </svg>
        </span>
      ))}
      {fishSchools.map((school) => (
        <span
          key={school.id}
          className={`fish-school school-swim-${school.direction}`}
          style={{
            top: school.top,
            width: school.size,
            animationDelay: `${school.delay}s`,
            animationDuration: `${school.duration}s`,
            '--school-color': school.color,
          } as CSSProperties}
        >
          <svg className={school.direction === 'left' ? 'school-art school-art-left' : 'school-art'} viewBox="0 0 160 72" role="presentation">
            {[8, 46, 86, 124].map((x, index) => (
              <g key={x} transform={`translate(${x} ${[14, 33, 7, 42][index]})`} className={`school-member school-member-${index + 1}`}>
                <g className="school-fish-bob">
                  <path className="school-fish-tail" d="M21 7 29 1 27 7 29 13Z" />
                  <path className="school-fish-body" d="M0 7C5 0 16 0 23 7 16 14 5 14 0 7Z" />
                  <circle className="school-fish-eye" cx="4" cy="5.5" r=".9" />
                </g>
              </g>
            ))}
          </svg>
        </span>
      ))}
      {dolphins.map((dolphin) => (
        <span
          key={dolphin.id}
          className="ocean-dolphin"
          style={{
            top: dolphin.top,
            width: dolphin.size,
            animationDelay: `${dolphin.delay}s`,
            animationDuration: `${dolphin.duration}s`,
          }}
        >
          <svg viewBox="0 0 100 60" role="presentation">
            <path className="dolphin-body" d="M8 36c13-19 39-23 60-14 10 4 17 5 25 0-3 10-10 15-21 18-14 5-32 6-46 2-8-2-13 0-21 6 3-5 5-9 3-12Z" />
            <path className="dolphin-dorsal-fin" d="M46 24c3-10 10-16 17-13-2 7-5 11-10 16Z" />
            <path className="dolphin-side-fin" d="m49 41 11 12 3-15Z" />
            <path className="dolphin-tail" d="M12 35 4 27 2 34l9 4-8 9 9-3Z" />
            <circle className="dolphin-eye" cx="77" cy="29" r="1.5" />
          </svg>
        </span>
      ))}
      {crabs.map((crab) => (
        <span
          key={crab.id}
          className="tiny-crab"
          style={{
            width: crab.size,
            animationDelay: `${crab.delay}s`,
            animationDuration: `${crab.duration}s`,
          }}
        >
          <svg viewBox="0 0 64 52" role="presentation">
            <g className="crab-legs">
              <path d="m19 34-8 7m13-5-5 10m23-12 8 7m-13-5 5 10" />
            </g>
            <path className="crab-claws" d="M17 25 8 17l-5 2 4 8 8 4m32-6 9-8 5 2-4 8-8 4" />
            <ellipse className="crab-body" cx="32" cy="30" rx="17" ry="12" />
            <circle className="crab-eye-stalk" cx="25" cy="19" r="3" />
            <circle className="crab-eye-stalk" cx="39" cy="19" r="3" />
            <circle className="crab-eye" cx="25" cy="19" r="1" />
            <circle className="crab-eye" cx="39" cy="19" r="1" />
          </svg>
        </span>
      ))}
      {(['left', 'right'] as const).map((side) => (
        <span key={side} className={`reef-coral reef-coral-${side}`}>
          <svg viewBox="0 0 120 160" role="presentation">
            <path className="reef-branch reef-branch-one" d="M12 158c8-26 1-39 14-57 8-11 5-22 2-33m-2 33-14-12m17 16 16-17M26 101c-8-8-11-18-9-28m11 10 12-10" />
            <path className="reef-branch reef-branch-two" d="M45 159c-3-25 9-36 5-56-3-13 4-25 11-34m-12 34-16-10m17 2 16-13m-5-13 1-21" />
            <path className="reef-branch reef-branch-three" d="M77 159c-8-22-2-35 8-49 8-11 6-22 4-34m-4 34 15-11m-21 0-13-15" />
            <path className="reef-seagrass reef-seagrass-one" d="M28 159c-8-28-1-47 8-61m-5 62c-1-30 10-49 19-59" />
            <path className="reef-seagrass reef-seagrass-two" d="M65 159c13-27 9-47-1-66m6 66c4-30-2-49-9-63" />
          </svg>
        </span>
      ))}
      {randomStars.map((star) => (
        <span
          key={star.id}
          className="random-twinkle"
          style={{
            left: star.left,
            top: star.top,
            fontSize: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        >
          {star.symbol}
        </span>
      ))}
      <span className="sparkle sparkle-one">✦</span>
      <span className="sparkle sparkle-two">✧</span>
      <span className="sparkle sparkle-three">✦</span>
    </div>
  )
}
