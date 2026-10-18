import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FastForward } from 'lucide-react';
import type { birthdayConfig } from '../data/birthdayConfig';

type LetterConfig = typeof birthdayConfig.letter;

interface LetterEnvelopeProps {
  letter: LetterConfig;
  recipientName: string;
  reducedMotion: boolean;
}

interface TypedParagraphProps {
  author?: string;
  text: string;
  startDelay: number;
  instant: boolean;
}

/** Types its text out over time; instant when skipped or motion is reduced. */
function TypedParagraph({ author, text, startDelay, instant }: TypedParagraphProps) {
  const [count, setCount] = useState(instant ? text.length : 0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (instant) {
      setCount(text.length);
      return undefined;
    }
    setCount(0);
    const timeout = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setCount((current) => {
          if (current >= text.length) return text.length;
          return current + 2;
        });
      }, 18);
    }, startDelay);

    return () => {
      window.clearTimeout(timeout);
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [text, startDelay, instant]);

  const done = count >= text.length;

  return (
    <div>
      {author ? <p className="letter__author">{author}</p> : null}
      <p>
        {text.slice(0, count)}
        {!done ? <span aria-hidden="true">▍</span> : null}
      </p>
    </div>
  );
}

export default function LetterEnvelope({
  letter,
  recipientName,
  reducedMotion,
}: LetterEnvelopeProps) {
  const [opened, setOpened] = useState(false);
  const [skip, setSkip] = useState(false);
  const instant = skip || reducedMotion;
  const stagger = 2800;

  return (
    <div className="envelope-wrap">
      {!opened ? (
        <motion.button
          type="button"
          className="envelope"
          onClick={() => setOpened(true)}
          aria-label={letter.sealLabel}
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
        >
          <span className="envelope__flap" aria-hidden="true" />
          <span className="envelope__seal" aria-hidden="true">
            For you
          </span>
          <span className="envelope__label">{letter.sealLabel}</span>
        </motion.button>
      ) : (
        <>
          {!instant ? (
            <div className="letter__toolbar">
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => setSkip(true)}
              >
                <FastForward size={15} aria-hidden /> Skip the typing
              </button>
            </div>
          ) : null}

          <motion.article
            className="letter"
            initial={reducedMotion ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.2, 0.8, 0.25, 1] }}
          >
            <h3>{letter.greeting.replace('{name}', recipientName)}</h3>

            <TypedParagraph
              text={letter.intro}
              startDelay={instant ? 0 : 300}
              instant={instant}
            />

            {letter.paragraphs.map((paragraph, index) => (
              <TypedParagraph
                key={paragraph.id}
                author={paragraph.author}
                text={paragraph.text}
                startDelay={instant ? 0 : 300 + (index + 1) * stagger}
                instant={instant}
              />
            ))}

            <TypedParagraph
              text={letter.closing}
              startDelay={instant ? 0 : 300 + (letter.paragraphs.length + 1) * stagger}
              instant={instant}
            />

            <div className="letter__signatures">
              {letter.signatures.map((name) => (
                <span key={name}>— {name}</span>
              ))}
            </div>
          </motion.article>
        </>
      )}
    </div>
  );
}
