import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import StarField from './components/StarField';
import PhotoStrip from './components/PhotoStrip';
import ChapterNavigation, { type ChapterMeta } from './components/ChapterNavigation';
import { birthdayConfig } from './data/birthdayConfig';
import {
  ArchiveChapter,
  EntranceChapter,
  GiftChapter,
  LetterChapter,
  MoonChapter,
  QuizChapter,
  VoicesChapter,
} from './chapters/Chapters';

const CHAPTERS: ChapterMeta[] = [
  { id: 'entrance', label: 'Start', title: 'The secret entrance' },
  { id: 'archive', label: 'Archive', title: 'Our friendship archive' },
  { id: 'voices', label: 'Voices', title: 'Three voices, three wishes' },
  { id: 'quiz', label: 'Challenge', title: 'The friendship challenge' },
  { id: 'moon', label: 'Moon', title: 'The Moon on your birthday' },
  { id: 'letter', label: 'Letter', title: 'A letter from the three of us' },
  { id: 'gift', label: 'Gift', title: 'The final gift reveal' },
];

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion === true;
  const [activeId, setActiveId] = useState<string>('entrance');

  // Scrollspy: track which section is most in view and highlight it in the nav.
  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const strips = birthdayConfig.photoStrips;
  const strip = (i: number, flip: boolean) => (
    <PhotoStrip photos={strips[i] ?? []} reducedMotion={reducedMotion} flip={flip} />
  );

  return (
    <div className="app-shell">
      <StarField />

      <main>
        <EntranceChapter reducedMotion={reducedMotion} />
        {strip(0, false)}
        <ArchiveChapter reducedMotion={reducedMotion} />
        {strip(1, true)}
        <VoicesChapter reducedMotion={reducedMotion} />
        {strip(2, false)}
        <QuizChapter reducedMotion={reducedMotion} />
        {strip(3, true)}
        <MoonChapter reducedMotion={reducedMotion} />
        <LetterChapter reducedMotion={reducedMotion} />
        <GiftChapter reducedMotion={reducedMotion} />
      </main>

      <ChapterNavigation chapters={CHAPTERS} currentId={activeId} onSelect={scrollTo} />
    </div>
  );
}
