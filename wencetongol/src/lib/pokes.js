// The theme-toggle tally behind the rail's "pokes this month" line.
//
// It lives in this browser's localStorage, so it is the visitor's own count
// rather than a shared one: a global tally would need a store behind it, and
// there is no reason to stand one up for a joke. The month is saved alongside
// the number so the label stays honest -- a count from September is not this
// month's, and starts again rather than quietly becoming an all-time total.

const STORAGE_KEY = "pokes";

const currentMonth = () => new Date().toISOString().slice(0, 7);

export const readPokes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const saved = JSON.parse(raw);
    return saved.month === currentMonth() ? Number(saved.count) || 0 : 0;
  } catch {
    // Unreadable or malformed storage just means no pokes yet.
    return 0;
  }
};

export const writePokes = (count) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ month: currentMonth(), count }),
    );
  } catch {
    // Not persisting is survivable; the number still moves this session.
  }
};
