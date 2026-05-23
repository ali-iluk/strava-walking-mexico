/** Session key + obfuscated credential check (client-side guard only). */
const SESSION_KEY = 'wm:sess:v1';
const SESSION_HOURS = 8;

/** XOR-masked code units (not stored as plain text). */
const MASK = 0x2f;
const UNITS = [77, 99, 98, 78, 88, 103, 118, 121, 78];

function matchesCredential(value: string): boolean {
  if (value.length !== UNITS.length) return false;
  for (let i = 0; i < UNITS.length; i++) {
    if ((value.charCodeAt(i) ^ MASK) !== UNITS[i]) return false;
  }
  return true;
}

function sessionDigest(): string {
  const seed = UNITS.map((u) => u ^ MASK).join('');
  return btoa(`${seed}:${Date.now()}`).slice(0, 24);
}

export function hasEditSession(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { exp: number };
    return typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export function grantEditSession(): void {
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ t: sessionDigest(), exp }));
}

export function clearEditSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function verifyCredential(value: string): boolean {
  return matchesCredential(value);
}

export class EditAccessDeniedError extends Error {
  constructor() {
    super('Edit access denied');
    this.name = 'EditAccessDeniedError';
  }
}
