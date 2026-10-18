/**
 * Tiny audio bus: guarantees that at most one audio element plays at a time
 * (voice notes must never overlap, and background music yields to them).
 */
const registered = new Set<HTMLAudioElement>();

export function registerAudioElement(el: HTMLAudioElement): () => void {
  registered.add(el);
  return () => {
    registered.delete(el);
  };
}

export function pauseAllExcept(except?: HTMLAudioElement | null): void {
  registered.forEach((el) => {
    if (el !== except && !el.paused) el.pause();
  });
}

/** Play one element after silencing everything else. Swallows autoplay rejections. */
export async function playExclusive(el: HTMLAudioElement): Promise<void> {
  pauseAllExcept(el);
  try {
    await el.play();
  } catch {
    /* blocked autoplay or interrupted playback — caller handles UI state */
  }
}
