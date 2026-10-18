import { useMemo, type CSSProperties } from 'react';

/** deterministic PRNG so the sky looks the same on every load */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function starShadows(count: number, seed: number, maxSize: number): string {
  const rnd = mulberry32(seed);
  const parts: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = (rnd() * 100).toFixed(2);
    const y = (rnd() * 100).toFixed(2);
    const size = (0.6 + rnd() * maxSize).toFixed(2);
    const alpha = (0.25 + rnd() * 0.6).toFixed(2);
    parts.push(`${x}vw ${y}vh 0 ${size}px rgba(233, 237, 255, ${alpha})`);
  }
  return parts.join(', ');
}

export default function StarField() {
  const far = useMemo(
    () => ({ boxShadow: starShadows(90, 7, 1.1), width: 1, height: 1, borderRadius: '50%' }),
    [],
  ) as CSSProperties;
  const near = useMemo(
    () => ({ boxShadow: starShadows(46, 23, 1.9), width: 1, height: 1, borderRadius: '50%' }),
    [],
  ) as CSSProperties;

  return (
    <div className="starfield" aria-hidden="true">
      <div className="starfield__layer starfield__layer--far" style={far} />
      <div className="starfield__layer starfield__layer--near" style={near} />
    </div>
  );
}
