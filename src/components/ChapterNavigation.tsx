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

  return (
    <nav className="chapter-nav" aria-label="Chapters">
      <div className="chapter-nav__scroll">
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
