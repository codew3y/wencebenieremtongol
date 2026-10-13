// The shared poke tally behind the rail's "pokes this month" line.
//
// The real counter lives in Redis behind /api/pokes, so the number is the same
// for everybody rather than one per browser. localStorage is kept only as the
// fallback for a deploy with no store configured, and as the first thing shown
// while the network round trip is in flight -- a rail that renders "0" and then
// jumps to the real figure reads as a bug.
//
// The month is saved alongside the number for the same reason the server keys
// by month: a count from September is not this month's.

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

// Resolves to the shared count, or null when there is no store behind the
// endpoint and the caller should keep using its own tally.
const ask = async (method) => {
  try {
    const response = await fetch("/api/pokes", {
      method,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok && response.status !== 429) return null;
    const data = await response.json();
    return data.configured && typeof data.count === "number"
      ? data.count
      : null;
  } catch {
    // Offline, blocked, or running from `vite preview` with no functions.
    return null;
  }
};

export const fetchPokes = () => ask("GET");
export const sendPoke = () => ask("POST");
