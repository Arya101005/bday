import { useEffect, useRef } from 'react';

export interface ChapterMeta {
  id: string;
  label: string;
  title: string;
}

interface ChapterNavigationProps {
  chapters: ChapterMeta[];
  currentId: string;
  onSelect: (id: string) => void;
}

export default function ChapterNavigation({
  chapters,
  currentId,
  onSelect,
}: ChapterNavigationProps) {
  const currentIndex = chapters.findIndex((c) => c.id === currentId);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* Keep the current chapter's pill fully visible — on narrow screens the strip
     scrolls, and a half-cut active pill reads like a bug. Rect-based maths:
     offsetLeft is relative to the fixed nav, not the scroll container. */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;

    const centerActive = () => {
      const active = container.querySelector<HTMLElement>('[aria-current="true"]');
      if (!active) return;
      const maxLeft = container.scrollWidth - container.clientWidth;
      if (maxLeft <= 0) return;
      const cr = container.getBoundingClientRect();
      const ar = active.getBoundingClientRect();
      const pillLeft = ar.left - cr.left + container.scrollLeft;
      const pillRight = pillLeft + ar.width;
      const viewL = container.scrollLeft;
      const viewR = viewL + container.clientWidth;
      if (pillLeft >= viewL && pillRight <= viewR) return;
      const target = pillLeft - (container.clientWidth - ar.width) / 2;
      const left = Math.max(0, Math.min(target, maxLeft));
      if (Math.abs(container.scrollLeft - left) <= 1) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      container.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
    };

    centerActive();
    /* Webfonts change pill widths after first paint; resize changes the strip. */
    document.fonts?.ready.then(centerActive).catch(() => undefined);
    window.addEventListener('resize', centerActive);
    return () => window.removeEventListener('resize', centerActive);
  }, [currentId, chapters]);

  return (
    <nav className="chapter-nav" aria-label="Chapters">
      <div className="chapter-nav__scroll" ref={scrollRef}>
        {chapters.map((chapter, index) => {
          const isCurrent = chapter.id === currentId;
          return (
            <button
              key={chapter.id}
              type="button"
              className="chapter-nav__dot"
              aria-current={isCurrent ? 'true' : undefined}
              onClick={() => onSelect(chapter.id)}
              title={chapter.title}
            >
              <span aria-hidden="true">{index + 1}</span>
              {chapter.label}
            </button>
          );
        })}
      </div>
      <span className="chapter-nav__progress" aria-live="polite">
        Chapter {currentIndex + 1} / {chapters.length}
      </span>
    </nav>
  );
}
