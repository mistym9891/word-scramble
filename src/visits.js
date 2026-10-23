// Privacy-friendly visit counter: one anonymous request per page load.
// No cookies, no identifiers, no IP stored on the counting side (only a per-day aggregate count per site).
// The endpoint is injected at build time; when it is empty nothing is sent.
const ENDPOINT = import.meta.env.VITE_VISITS_URL || '';

export function countVisit(site = 'word-scramble') {
  if (!ENDPOINT || typeof navigator === 'undefined') return false;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return false;
  const url = `${ENDPOINT}?site=${encodeURIComponent(site)}`;
  try {
    if (navigator.sendBeacon) return navigator.sendBeacon(url);
    fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}
