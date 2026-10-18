/** Prefix a public/ asset path with the app's base URL. */
export function asset(path: string): string {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

/** true when a media src has been configured */
export function hasAsset(path: string | undefined | null): boolean {
  return Boolean(path && path.trim().length > 0);
}

const memory = new Map<string, unknown>();

export function loadJSON<T>(key: string, fallback: T): T {
  if (memory.has(key)) return memory.get(key) as T;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    memory.set(key, parsed);
    return parsed;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota — journey continues in memory */
  }
}
