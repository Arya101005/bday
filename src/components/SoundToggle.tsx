import { useEffect, useRef, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { asset, hasAsset } from '../lib/browser';
import { pauseAllExcept, playExclusive, registerAudioElement } from '../lib/audioBus';

interface SoundToggleProps {
  src: string;
  label: string;
}

/** Small sound toggle for the optional background music track. */
export default function SoundToggle({ src, label }: SoundToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return undefined;
    return registerAudioElement(el);
  }, []);

  if (!hasAsset(src)) return null;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      void playExclusive(el);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={asset(src)}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          pauseAllExcept();
        }}
      />
      <button
        type="button"
        className="btn btn--ghost btn--small"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Pause background music' : label}
      >
        {playing ? <VolumeX size={16} aria-hidden /> : <Music size={16} aria-hidden />}
        {playing ? 'Music off' : label}
      </button>
    </>
  );
}
