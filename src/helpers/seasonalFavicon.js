// Swaps the browser-tab favicon based on the current month.
// Note: this only affects the live tab icon. The installed PWA's home-screen
// icon (manifest.webmanifest) is fixed at install/update time and can't be
// swapped live -- that stays the year-round default icon.

function seasonForMonth(month) {
  if (month === 12 || month === 1 || month === 2) {
    return 'winter';
  }
  if (month >= 3 && month <= 5) {
    return 'spring';
  }
  if (month >= 9 && month <= 11) {
    return 'fall';
  }
  return null; // summer (6-8) keeps the default icon
}

export function applySeasonalFavicon(date = new Date()) {
  const season = seasonForMonth(date.getMonth() + 1);

  if (!season) {
    return;
  }

  const href = `/season-icons/${season}-32.png`;
  let link = document.querySelector('link[rel="icon"]');

  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }

  link.type = 'image/png';
  link.href = href;
}

export default applySeasonalFavicon;
