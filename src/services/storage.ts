/** Safe localStorage wrapper that falls back to memory (private mode, quota, corrupt data). */
const memory = new Map<string, string>();

export function readStored<T>(key: string, isValid: (value: unknown) => value is T, fallback: T): T {
  let raw = memory.get(key);
  try {
    raw ??= window.localStorage.getItem(key) ?? undefined;
  } catch {
    /* storage unavailable */
  }
  if (!raw) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown): void {
  const raw = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, raw);
    memory.delete(key);
  } catch {
    memory.set(key, raw);
  }
}

export function removeStored(key: string): void {
  memory.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}
