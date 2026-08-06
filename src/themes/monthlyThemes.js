// Monthly movie-themed config for Movie Weather.
// One entry per calendar month (1-12): color mood, an original in-app "feature"
// title/tagline (Parker's own invented titles -- not real movie titles, safe to
// display directly), a splash-screen poster + theme audio, and a CSS animation
// keyword used by the splash screen.
//
// Poster/audio files live in public/monthly/<month-number>/ (poster.jpg, theme.mp3).

const monthlyThemes = {
  1: {
    name: "New Year Sci-Fi",
    title: "The First Forecast",
    genre: "Winter Adventure",
    tagline: "A new year. A new journey. A new forecast.",
    animation: "snowfall",
    accent: "#00e5ff",
    bg: "#0a0e1a",
  },
  2: {
    name: "Romance",
    title: "Shadow's Choice",
    genre: "Mystery Adventure",
    tagline: "Sometimes the smallest signs reveal the biggest secrets.",
    animation: "winter_glow",
    accent: "#ff4d6d",
    bg: "#1a0a12",
  },
  3: {
    name: "Adventure & Fantasy",
    title: "The Winds of Change",
    genre: "Fantasy Adventure",
    tagline: "Every storm carries a new beginning.",
    animation: "spring_wind",
    accent: "#4caf50",
    bg: "#0e1a10",
  },
  4: {
    name: "Animated Family",
    title: "When The Rain Remembers",
    genre: "Mystery Drama",
    tagline: "Every raindrop tells a story.",
    animation: "rain",
    accent: "#ffb300",
    bg: "#1a160a",
  },
  5: {
    name: "Superhero Season",
    title: "The Garden Beyond",
    genre: "Coming Of Age Adventure",
    tagline: "Growth begins where dreams take root.",
    animation: "flower_bloom",
    accent: "#e53935",
    bg: "#1a0a0a",
  },
  6: {
    name: "Summer Action",
    title: "Beyond The Horizon",
    genre: "Summer Adventure",
    tagline: "The journey starts when you step outside.",
    animation: "sun_rays",
    accent: "#ff9800",
    bg: "#1a120a",
  },
  7: {
    name: "Blockbuster",
    title: "The Last Firework",
    genre: "Action Adventure",
    tagline: "Every spark begins a story.",
    animation: "fireworks",
    accent: "#ffd700",
    bg: "#12100a",
  },
  8: {
    name: "Thriller",
    title: "The Golden Hour",
    genre: "Adventure Drama",
    tagline: "Summer's final chapter shines brightest.",
    animation: "sunset",
    accent: "#26c6da",
    bg: "#0a1418",
  },
  9: {
    name: "Coming of Age",
    title: "The New Chapter",
    genre: "Inspirational Drama",
    tagline: "Every change creates a new beginning.",
    animation: "fall_leaves",
    accent: "#d4a373",
    bg: "#181410",
  },
  10: {
    name: "Horror",
    title: "The Hollow Night",
    genre: "Psychological Horror",
    tagline: "Some shadows were never meant to be found.",
    animation: "fog",
    accent: "#ff6f00",
    bg: "#0d0a14",
  },
  11: {
    name: "Family Adventure",
    title: "The Harvest Table",
    genre: "Family Drama",
    tagline: "The greatest stories are shared together.",
    animation: "fall_breeze",
    accent: "#8d6e63",
    bg: "#14100c",
  },
  12: {
    name: "Holiday Classics",
    title: "The Midnight Carol",
    genre: "Holiday Creature Feature",
    tagline: "Not every gift wants to be opened.",
    animation: "snow_magic",
    accent: "#c62828",
    bg: "#0c1410",
  },
};

export function getThemeForMonth(date = new Date()) {
  const month = date.getMonth() + 1;
  return monthlyThemes[month];
}

export function getPosterForMonth(monthNumber) {
  return `/monthly/${String(monthNumber).padStart(2, "0")}/poster.jpg`;
}

export function getAudioForMonth(monthNumber) {
  return `/monthly/${String(monthNumber).padStart(2, "0")}/theme.mp3`;
}

export default monthlyThemes;
