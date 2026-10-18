import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImageOff } from 'lucide-react';
import type { MemoryPhoto } from '../data/birthdayConfig';
import { asset, hasAsset } from '../lib/browser';
import Placeholder from './Placeholder';

interface PhotoStripProps {
  photos: MemoryPhoto[];
  reducedMotion: boolean;
  /** flip the tilt direction so neighbouring strips feel hand-placed */
  flip?: boolean;
}

/**
 * A small, anonymous row of photos woven between sections. No names, no
 * captions — just a soft visual break. Uses object-fit: contain so nothing
 * gets cropped, whatever shape the photo is.
 */
export default function PhotoStrip({ photos, reducedMotion, flip = false }: PhotoStripProps) {
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  if (photos.length === 0) return null;

  return (
    <div className={`photo-strip${flip ? ' photo-strip--flip' : ''}`} aria-hidden="true">
      {photos.map((photo, index) => {
        const showImage = hasAsset(photo.src) && !broken[photo.id];
        return (
          <motion.div
            key={photo.id}
            className="photo-strip__item"
            initial={reducedMotion ? false : { opacity: 0, y: 24, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reducedMotion ? 0 : 0.6,
              delay: reducedMotion ? 0 : index * 0.08,
            }}
          >
            <div className="photo-strip__frame">
              {showImage ? (
                <img
                  src={asset(photo.src)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={() => setBroken((prev) => ({ ...prev, [photo.id]: true }))}
                />
              ) : (
                <Placeholder label="" icon={<ImageOff size={18} aria-hidden />} />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
