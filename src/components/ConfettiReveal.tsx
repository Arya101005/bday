import { useEffect, useRef } from 'react';

interface ConfettiRevealProps {
  /** set to true once to burst */
  active: boolean;
  reducedMotion: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  life: number;
}

const COLORS = ['#e9c98c', '#f2b6cd', '#b7a6f2', '#ccd2ea', '#ffffff'];

export default function ConfettiReveal({ active, reducedMotion }: ConfettiRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active || reducedMotion) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles: Particle[] = [];
    const origins: Array<[number, number]> = [
      [width * 0.5, height * 0.55],
      [width * 0.2, height * 0.5],
      [width * 0.8, height * 0.5],
    ];
    origins.forEach(([ox, oy], burst) => {
      for (let i = 0; i < 70; i += 1) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.1;
        const speed = 6 + Math.random() * 9;
        particles.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed + (burst - 1) * 2,
          vy: Math.sin(angle) * speed - Math.random() * 2,
          size: 5 + Math.random() * 7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.3,
          life: 1,
        });
      }
    });

    let frame = 0;
    let raf = 0;
    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.vy += 0.22;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.life = Math.max(0, p.life - 0.004);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.62);
        ctx.restore();
      });
      if (frame < 260) {
        raf = window.requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };
    raf = window.requestAnimationFrame(draw);

    return () => window.cancelAnimationFrame(raf);
  }, [active, reducedMotion]);

  if (!active || reducedMotion) return null;
  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
