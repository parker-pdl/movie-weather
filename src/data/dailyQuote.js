import monthlyQuotes from "./monthlyQuotes";

// Picks today's quote: day-of-month indexes into that month's quote list
// (wraps with modulo so it's safe even on a 28/29/30-day month).
export function getQuoteForDate(date = new Date()) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const quotes = monthlyQuotes[month];

  if (!quotes || !quotes.length) {
    return null;
  }

  const index = (day - 1) % quotes.length;

  return quotes[index];
}

export default getQuoteForDate;
