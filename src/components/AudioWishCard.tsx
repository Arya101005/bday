import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Pause, Play, RotateCcw } from 'lucide-react';
import type { VoiceWish } from '../data/birthdayConfig';
import { asset, hasAsset } from '../lib/browser';
import { pauseAllExcept, playExclusive, registerAudioElement } from '../lib/audioBus';
import Placeholder from './Placeholder';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/** deterministic pseudo-random bar heights for the decorative waveform */
function waveHeights(seedText: string, count: number): number[] {
  let seed = 0;
  for (let i = 0; i < seedText.length; i += 1) seed = (seed * 31 + seedText.charCodeAt(i)) % 100000;
  const heights: number[] = [];
  for (let i = 0; i < count; i += 1) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    heights.push(0.28 + (seed / 2147483648) * 0.72);
  }
  return heights;
}

interface AudioWishCardProps {
  wish: VoiceWish;
  /** 1-based card number, used only for the file hint */
  number: number;
}

export default function AudioWishCard({ wish, number }: AudioWishCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const configured = hasAsset(wish.src);
  const [loadKey, setLoadKey] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return undefined;
    return registerAudioElement(el);
  }, [loadKey]);

  const bars = useMemo(() => waveHeights(wish.id, 34), [wish.id]);
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  const expectedPath = `/audio/wishes/friend-${number}-wish.mp3`;
  const initials = wish.friendName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const toggle = () => {
    const el = audioRef.current;
    if (!el || hasError) return;
    if (playing) {
      el.pause();
    } else {
      void playExclusive(el);
    }
  };

  const retry = () => {
    setHasError(false);
    setCurrentTime(0);
    setDuration(0);
    setLoadKey((k) => k + 1);
  };

  const onSeek = (value: number) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(value)) return;
    el.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <article className="glass wish-card">
      <header className="wish-card__head">
        <div className="wish-card__avatar" aria-hidden="true">
          {hasAsset(wish.avatarSrc) ? (
            <img src={asset(wish.avatarSrc)} alt="" loading="lazy" />
          ) : (
            initials
          )}
        </div>
        <div>
          <h3 className="wish-card__name">{wish.friendName}</h3>
          <p className="wish-card__role">Voice wish {number} of 3</p>
        </div>
      </header>

      {wish.intro ? <p className="wish-card__intro">{wish.intro}</p> : null}

      {!configured ? (
        <>
          <Placeholder label="Voice note not uploaded yet" path={expectedPath} />
          <p className="wish-card__status">Sample card — no audio is pretending to be real here.</p>
        </>
      ) : hasError ? (
        <>
          <Placeholder label="This voice note could not be loaded" path={wish.src} />
          <div>
            <button type="button" className="btn btn--ghost btn--small" onClick={retry}>
              <RotateCcw size={15} aria-hidden /> Try again
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className={`wish-card__wave${playing ? ' is-playing' : ''}`}
            aria-hidden="true"
          >
            {bars.map((height, i) => {
              const played = i / bars.length <= progress && progress > 0;
              return (
                <span
                  key={i}
                  className={`wish-card__bar${played ? ' is-played' : ''}${
                    i % 3 === 0 ? ' is-live' : ''
                  }`}
                  style={{
                    height: `${Math.round(height * 100)}%`,
                    animationDelay: `${(i % 7) * 90}ms`,
                  }}
                />
              );
            })}
          </div>

          <div className="wish-card__controls">
            <button
              type="button"
              className="icon-btn"
              onClick={toggle}
              aria-label={playing ? `Pause ${wish.friendName}'s voice note` : `Play ${wish.friendName}'s voice note`}
            >
              {playing ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
            </button>
            <input
              className="wish-card__seek"
              type="range"
              min={0}
              max={Number.isFinite(duration) && duration > 0 ? duration : 0}
              step={0.1}
              value={Number.isFinite(currentTime) ? Math.min(currentTime, duration || 0) : 0}
              onChange={(event) => onSeek(Number(event.target.value))}
              aria-label="Seek within the voice note"
              disabled={!Number.isFinite(duration) || duration <= 0}
            />
            <span className="wish-card__time">
              {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '--:--'}
            </span>
          </div>

          <audio
            key={loadKey}
            ref={audioRef}
            src={asset(wish.src)}
            preload="metadata"
            onPlay={() => {
              setPlaying(true);
              pauseAllExcept(audioRef.current);
            }}
            onPause={() => setPlaying(false)}
            onLoadedMetadata={(event) => {
              const value = event.currentTarget.duration;
              setDuration(Number.isFinite(value) ? value : 0);
            }}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onEnded={() => {
              setPlaying(false);
              setCompleted(true);
            }}
            onError={() => setHasError(true)}
          />

          {completed ? (
            <p className="wish-card__status">
              <CheckCircle2 size={15} aria-hidden /> Played
            </p>
          ) : null}

          {wish.transcript ? (
            <p className="wish-card__transcript">{wish.transcript}</p>
          ) : null}
        </>
      )}
    </article>
  );
}
