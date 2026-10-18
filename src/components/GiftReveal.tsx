import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Gift, MapPin, RotateCcw } from 'lucide-react';
import type { birthdayConfig } from '../data/birthdayConfig';
import { asset, hasAsset } from '../lib/browser';
import ConfettiReveal from './ConfettiReveal';
import Placeholder from './Placeholder';

type GiftConfig = typeof birthdayConfig.gift;

interface GiftRevealProps {
  gift: GiftConfig;
  recipientName: string;
  reducedMotion: boolean;
  onReplay: () => void;
}

/** 0 = box breathing, 1 = "konjam mele paar" tease, 2 = full reveal. */
type Beat = 0 | 1 | 2;

export default function GiftReveal({
  gift,
  recipientName,
  reducedMotion,
  onReplay,
}: GiftRevealProps) {
  const [beat, setBeat] = useState<Beat>(0);
  const configured = hasAsset(gift.title) || hasAsset(gift.revealMessage);

  const advance = () => {
    setBeat((current) => (current === 0 ? 1 : 2));
  };

  const openBox = () => {
    if (beat === 0) {
      advance();
      return;
    }
    if (beat === 1) {
      setBeat(2);
    }
  };

  const dur = reducedMotion ? 0 : 0.7;

  return (
    <div className="gift-stage">
      <ConfettiReveal active={beat === 2} reducedMotion={reducedMotion} />

      <motion.button
        type="button"
        className={`gift-box${beat > 0 ? ' is-open' : ''}`}
        onClick={openBox}
        aria-label={gift.openLabel}
        aria-expanded={beat > 0}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: beat === 1 && !reducedMotion ? [0, -4, 4, -3, 3, 0] : 0,
        }}
        transition={{ duration: beat === 1 && !reducedMotion ? 0.6 : dur }}
        whileHover={beat === 0 ? { scale: 1.04 } : undefined}
      >
        <span className="gift-box__body" aria-hidden="true" />
        <span className="gift-box__ribbon-v" aria-hidden="true" />
        <span className="gift-box__lid" aria-hidden="true" />
        <span className="gift-box__bow" aria-hidden="true" />
      </motion.button>

      <AnimatePresence mode="wait">
        {beat === 0 ? (
          <motion.div
            key="beat-0"
            className="gift-intro"
            initial={false}
            exit={reducedMotion ? undefined : { opacity: 0, y: -14 }}
            transition={{ duration: dur * 0.6 }}
          >
            <p className="chapter__lead">{gift.preTitle}</p>
            <button type="button" className="btn" onClick={() => setBeat(1)}>
              <Gift size={18} aria-hidden /> {gift.openLabel}
            </button>
          </motion.div>
        ) : null}

        {beat === 1 ? (
          <motion.div
            key="beat-1"
            className="gift-tease"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: dur }}
          >
            <motion.span
              className="gift-tease__arrow"
              animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowUp size={30} aria-hidden />
            </motion.span>
            <p className="gift-tease__line">{gift.teaseLine}</p>
            <p className="gift-tease__sub">{gift.teaseSub}</p>
            <button type="button" className="btn" onClick={() => setBeat(2)}>
              Ok fine, show me
            </button>
          </motion.div>
        ) : null}

        {beat === 2 ? (
          <motion.div
            key="beat-2"
            className="glass gift-reveal-card"
            initial={reducedMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="gift-punch">{gift.punchTitle}</h3>
            <p className="gift-reveal-card__message">{gift.punchLine}</p>

            {configured ? (
              <p className="gift-reveal-card__message">
                {gift.title}
                {gift.revealMessage ? ` — ${gift.revealMessage}` : ''}
              </p>
            ) : null}

            {hasAsset(gift.imageSrc) ? (
              <div className="gift-media">
                <img src={asset(gift.imageSrc)} alt={gift.title || 'Your gift'} loading="lazy" />
              </div>
            ) : null}

            {hasAsset(gift.videoSrc) ? (
              <div className="gift-media">
                <video src={asset(gift.videoSrc)} controls playsInline preload="metadata" />
              </div>
            ) : null}

            {!configured ? (
              <Placeholder label={gift.placeholderNote} path="src/data/birthdayConfig.ts → gift" />
            ) : null}

            {hasAsset(gift.clue) ? (
              <div className="gift-clue">
                <MapPin size={20} aria-hidden style={{ color: 'var(--gold)', flex: 'none' }} />
                <div>
                  <p className="gift-clue__label">Where to find it</p>
                  <p>{gift.clue}</p>
                </div>
              </div>
            ) : null}

            {hasAsset(gift.finalInstruction) ? (
              <p className="gift-reveal-card__message">{gift.finalInstruction}</p>
            ) : null}

            <p className="gift-aside">{gift.asideLine}</p>

            <p className="gift-final">{gift.finalMessage.replace('{name}', recipientName)}</p>

            <div className="gift-signatories">
              {gift.signatories.map((name) => (
                <span key={name}>— {name}</span>
              ))}
            </div>

            <div style={{ marginTop: 22 }}>
              <button type="button" className="btn btn--ghost" onClick={onReplay}>
                <RotateCcw size={16} aria-hidden /> {gift.replayLabel}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
