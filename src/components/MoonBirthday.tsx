import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoonStar } from 'lucide-react';
import type { birthdayConfig } from '../data/birthdayConfig';
import { asset, hasAsset } from '../lib/browser';
import Placeholder from './Placeholder';

type MoonConfig = typeof birthdayConfig.moon;

interface MoonBirthdayProps {
  moon: MoonConfig;
  reducedMotion: boolean;
}

/**
 * Artistic lunar disk: a textured circle with a waning-gibbous terminator
 * (darkness creeping in from the right edge, as seen from the Northern
 * Hemisphere). Not a photograph — labelled as a visualization in the UI.
 */
function LunarDisk({ illuminationText }: { illuminationText: string }) {
  const match = /(\d+(?:\.\d+)?)/.exec(illuminationText);
  const fraction = match ? Math.min(Math.max(Number(match[1]) / 100, 0.02), 0.99) : 0.95;
  const radius = 96;
  const center = 100;
  const bulge = Math.abs(2 * fraction - 1) * radius;

  return (
    <svg
      className="moon-scene__disk"
      viewBox="0 0 200 200"
      role="img"
      aria-label="Illustration of the Moon in a waning gibbous phase"
    >
      <defs>
        <radialGradient id="lunar-surface" cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#f2f3f8" />
          <stop offset="55%" stopColor="#cfd3e0" />
          <stop offset="100%" stopColor="#9aa0b4" />
        </radialGradient>
        <radialGradient id="lunar-mare" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b91a6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8b91a6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lunar-shadow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#05060f" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#05060f" stopOpacity="0.98" />
        </linearGradient>
        <clipPath id="lunar-clip">
          <circle cx={center} cy={center} r={radius} />
        </clipPath>
        <filter id="lunar-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>

      <circle cx={center} cy={center} r={radius} fill="url(#lunar-surface)" />

      <g clipPath="url(#lunar-clip)">
        {/* maria — darker plains */}
        <ellipse cx="72" cy="74" rx="30" ry="24" fill="url(#lunar-mare)" />
        <ellipse cx="120" cy="120" rx="34" ry="26" fill="url(#lunar-mare)" />
        <ellipse cx="86" cy="140" rx="22" ry="16" fill="url(#lunar-mare)" />

        {/* craters */}
        {[
          [60, 112, 11],
          [140, 66, 8],
          [96, 46, 6],
          [150, 128, 10],
          [44, 84, 5],
          [118, 158, 7],
          [164, 96, 5],
        ].map(([cx, cy, r]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r={r} fill="#8d93a8" fillOpacity="0.45" />
            <circle cx={cx - r * 0.22} cy={cy - r * 0.22} r={r * 0.78} fill="#e7e9f1" fillOpacity="0.22" />
          </g>
        ))}

        {/* waning gibbous terminator: shadow on the right edge */}
        <path
          d={`M ${center} ${center - radius} A ${radius} ${radius} 0 0 1 ${center} ${
            center + radius
          } A ${bulge.toFixed(2)} ${radius} 0 0 0 ${center} ${center - radius} Z`}
          fill="url(#lunar-shadow)"
          filter="url(#lunar-soft)"
        />
      </g>

      <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(240,243,255,0.28)" strokeWidth="0.8" />
    </svg>
  );
}

export default function MoonBirthday({ moon, reducedMotion }: MoonBirthdayProps) {
  const [revealed, setRevealed] = useState(false);
  const animation = reducedMotion
    ? {}
    : { initial: { opacity: 0, scale: 0.92, y: 24 }, animate: { opacity: 1, scale: 1, y: 0 } };

  return (
    <div className="moon-scene">
      <h2 className="chapter__title" style={{ maxWidth: '20ch' }}>
        {moon.heading}
      </h2>
      <p className="chapter__lead">{moon.supportingText}</p>

      {!revealed ? (
        <button type="button" className="btn" onClick={() => setRevealed(true)}>
          <MoonStar size={18} aria-hidden /> {moon.buttonLabel}
        </button>
      ) : (
        <motion.div
          {...animation}
          transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, width: '100%' }}
        >
          {hasAsset(moon.imageSrc) ? (
            <img
              className="moon-scene__img"
              src={asset(moon.imageSrc)}
              alt="The Moon on October 19, 2005"
            />
          ) : (
            <LunarDisk illuminationText={moon.illumination} />
          )}

          <dl className="moon-facts">
            <div className="moon-fact">
              <dt>Date</dt>
              <dd>{moon.dateLabel}</dd>
            </div>
            <div className="moon-fact">
              <dt>Moon phase</dt>
              <dd>{moon.phase}</dd>
            </div>
            <div className="moon-fact">
              <dt>Illuminated</dt>
              <dd>{moon.illumination}</dd>
            </div>
          </dl>

          <p className="moon-scene__note">{moon.explanation}</p>
          <p className="moon-scene__message">{moon.message}</p>
          <p className="moon-scene__credit">{moon.credit}</p>

          {!hasAsset(moon.imageSrc) ? (
            <Placeholder
              label="Want a real photo? Drop one in"
              path="/images/moon/birthday-moon.png"
            />
          ) : null}
        </motion.div>
      )}
    </div>
  );
}
