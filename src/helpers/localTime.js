// Open-Meteo, when called with timezone=auto, returns date/time strings as
// naive local time for the requested location (e.g. "2026-08-02T14:00",
// "2026-08-02T06:12", "2026-08-02" for daily dates) -- no UTC offset or "Z"
// suffix. That means these strings can be parsed and compared directly
// without any manual timezone math: the browser's native Date parser treats
// a timezone-less ISO string as local time, which lines up with what the
// values already represent.

export function toDate(isoLocalString) {
  return new Date(isoLocalString);
}

export function hourOf(isoLocalString) {
  return Number(isoLocalString.slice(11, 13));
}

export function hhmmOf(isoLocalString) {
  return isoLocalString.slice(11, 16);
}

// Weekday index (0 = Sunday) for a date-only string like "2026-08-02",
// computed without going through the local Date constructor so it can't be
// shifted by a day depending on the browser's timezone.
export function weekdayOf(isoDateString) {
  const [year, month, day] = isoDateString.split('-').map(Number);

  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}
