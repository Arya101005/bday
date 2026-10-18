import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { birthdayConfig } from '../data/birthdayConfig';
import AudioWishCard from '../components/AudioWishCard';
import QuizChallenge from '../components/QuizChallenge';
import MoonBirthday from '../components/MoonBirthday';
import LetterEnvelope from '../components/LetterEnvelope';
import GiftReveal from '../components/GiftReveal';
import SoundToggle from '../components/SoundToggle';

export interface ChapterShellProps {
  id: string;
  kicker: string;
  title: string;
  lead?: string;
  /** id of the next section to scroll to; omit on the last section */
  nextId?: string;
  nextLabel?: string;
  children: ReactNode;
  reducedMotion: boolean;
  center?: boolean;
}

export function ChapterShell({
  id,
  kicker,
  title,
  lead,
  nextId,
  nextLabel = 'Continue',
  children,
  reducedMotion,
  center = false,
}: ChapterShellProps) {
  const scrollTo = (target: string) => {
    document.getElementById(target)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <motion.section
      id={id}
      className={`chapter${center ? ' chapter--center' : ''}`}
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.2, 0.8, 0.25, 1] }}
    >
      <p className="chapter__kicker">{kicker}</p>
      <h2 className="chapter__title">{title}</h2>
      {lead ? <p className="chapter__lead">{lead}</p> : null}
      {children}
      {nextId ? (
        <div className="chapter__continue">
          <button type="button" className="btn btn--ghost" onClick={() => scrollTo(nextId)}>
            {nextLabel} <ChevronDown size={17} aria-hidden />
          </button>
        </div>
      ) : null}
    </motion.section>
  );
}

interface ChapterProps {
  reducedMotion: boolean;
}

export function EntranceChapter({ reducedMotion }: ChapterProps) {
  const { landing, recipient, birthday, music } = birthdayConfig;
  return (
    <motion.section
      id="entrance"
      className="entrance"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 1.1 }}
    >
      <svg
        className="entrance__moon"
        viewBox="0 0 200 200"
        role="img"
        aria-label="A softly glowing moon"
      >
        <defs>
          <radialGradient id="entrance-moon" cx="38%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#f6f7fb" />
            <stop offset="60%" stopColor="#d7dae7" />
            <stop offset="100%" stopColor="#a2a7ba" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="86" fill="url(#entrance-moon)" opacity="0.95" />
        <circle cx="72" cy="84" r="14" fill="#9aa0b4" fillOpacity="0.35" />
        <circle cx="124" cy="122" r="20" fill="#9aa0b4" fillOpacity="0.28" />
        <circle cx="112" cy="62" r="8" fill="#9aa0b4" fillOpacity="0.3" />
      </svg>

      <motion.p
        className="entrance__kicker"
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reducedMotion ? 0 : 0.35, duration: 0.7 }}
      >
        {landing.kicker}
      </motion.p>

      <motion.h1
        className="entrance__title"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: reducedMotion ? 0 : 0.6, duration: 0.9 }}
      >
        {landing.title}
      </motion.h1>

      <p className="entrance__tagline">{landing.tagline}</p>

      <motion.p
        className="entrance__reveal"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reducedMotion ? 0 : 1.2, duration: 0.9 }}
      >
        {landing.revealLine}
      </motion.p>

      <p className="entrance__name">
        Happy birthday, {recipient.displayName}! Vaanga, start pannuvom.
      </p>

      <div className="entrance__meta">
        <span className="chip">{birthday.dateLabel}</span>
        <span className="chip">{landing.scrollHint}</span>
        <SoundToggle src={music.src} label={music.label} />
      </div>

      <div style={{ marginTop: 26 }}>
        <button
          type="button"
          className="btn"
          onClick={() =>
            document
              .getElementById('archive')
              ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
          }
        >
          {landing.beginLabel}
        </button>
      </div>
    </motion.section>
  );
}

export function ArchiveChapter({ reducedMotion }: ChapterProps) {
  return (
    <ChapterShell
      id="archive"
      kicker="Chapter two"
      title="Un moonju"
      lead="Photo la ellam crop aaguthu-nu solli photos-a summa veenga. Ipo full-a paakalam."
      nextId="voices"
      reducedMotion={reducedMotion}
    >
      <blockquote className="archive-note">
        “Nooru photo eduthom, kettadha vachom. Athu dhaan friendship.”
      </blockquote>
    </ChapterShell>
  );
}

export function VoicesChapter({ reducedMotion }: ChapterProps) {
  return (
    <ChapterShell
      id="voices"
      kicker="Chapter three"
      title="Moonu voice, moonu wishes"
      lead="Comfort-aana idathula irundhu play pannu. Oru nerathula oru per dhaan pesum — romba naalukku."
      nextId="quiz"
      reducedMotion={reducedMotion}
    >
      <div className="wishes">
        {birthdayConfig.voiceWishes.map((wish, index) => (
          <AudioWishCard key={wish.id} wish={wish} number={index + 1} />
        ))}
      </div>
    </ChapterShell>
  );
}

export function QuizChapter({ reducedMotion }: ChapterProps) {
  return (
    <ChapterShell
      id="quiz"
      kicker="Chapter four"
      title="Namma friendship test"
      lead={birthdayConfig.quiz.intro}
      nextId="moon"
      nextLabel="Moon-a kaattu"
      reducedMotion={reducedMotion}
    >
      <QuizChallenge questions={birthdayConfig.quiz.questions} reducedMotion={reducedMotion} />
    </ChapterShell>
  );
}

export function MoonChapter({ reducedMotion }: ChapterProps) {
  return (
    <ChapterShell
      id="moon"
      kicker="Chapter five"
      title="Unnoda birthday Moon"
      nextId="letter"
      nextLabel="Namma letter padikalam"
      reducedMotion={reducedMotion}
    >
      <MoonBirthday moon={birthdayConfig.moon} reducedMotion={reducedMotion} />
    </ChapterShell>
  );
}

export function LetterChapter({ reducedMotion }: ChapterProps) {
  return (
    <ChapterShell
      id="letter"
      kicker="Chapter six"
      title="Moonu per irundhu oru letter"
      lead="Kai-la ezhuthinen, type pannumbothu thappu thappu, aana full-a mean pannen."
      nextId="gift"
      nextLabel="Innum oru vishayam"
      reducedMotion={reducedMotion}
    >
      <LetterEnvelope
        letter={birthdayConfig.letter}
        recipientName={birthdayConfig.recipient.displayName}
        reducedMotion={reducedMotion}
      />
    </ChapterShell>
  );
}

export function GiftChapter({ reducedMotion }: ChapterProps) {
  return (
    <ChapterShell
      id="gift"
      kicker="Chapter seven"
      title="Final gift reveal"
      reducedMotion={reducedMotion}
    >
      <GiftReveal
        gift={birthdayConfig.gift}
        recipientName={birthdayConfig.recipient.displayName}
        reducedMotion={reducedMotion}
        onReplay={() =>
          document
            .getElementById('entrance')
            ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
        }
      />
    </ChapterShell>
  );
}
