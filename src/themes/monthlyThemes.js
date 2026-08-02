// Monthly movie-themed color/mood config for Movie Weather.
// One entry per calendar month (1-12). Placeholder genre-based themes --
// swap "name" and "movieInspiration" for real per-month design direction.
// Note: keep movieInspiration as an internal mood/design reference only --
// avoid using real movie titles, posters, or franchise names/art in shipped
// assets or copy (see docs/PLAN.md).

const monthlyThemes = {
  1: {
    name: "New Year Sci-Fi",
    movieInspiration: "Futuristic, neon, fresh-start energy",
    accent: "#00e5ff",
    bg: "#0a0e1a",
  },
  2: {
    name: "Romance",
    movieInspiration: "Warm pinks and reds, cozy indoor mood",
    accent: "#ff4d6d",
    bg: "#1a0a12",
  },
  3: {
    name: "Adventure & Fantasy",
    movieInspiration: "Lush greens, epic quest energy",
    accent: "#4caf50",
    bg: "#0e1a10",
  },
  4: {
    name: "Animated Family",
    movieInspiration: "Bright, playful, saturated primaries",
    accent: "#ffb300",
    bg: "#1a160a",
  },
  5: {
    name: "Superhero Season",
    movieInspiration: "Bold primaries, high-contrast action",
    accent: "#e53935",
    bg: "#1a0a0a",
  },
  6: {
    name: "Summer Action",
    movieInspiration: "Sun-bleached, high-energy blockbuster",
    accent: "#ff9800",
    bg: "#1a120a",
  },
  7: {
    name: "Blockbuster",
    movieInspiration: "Big, glossy, cinematic gold and black",
    accent: "#ffd700",
    bg: "#12100a",
  },
  8: {
    name: "Thriller",
    movieInspiration: "Moody teal and shadow, tense atmosphere",
    accent: "#26c6da",
    bg: "#0a1418",
  },
  9: {
    name: "Coming of Age",
    movieInspiration: "Soft autumn tones, nostalgic warmth",
    accent: "#d4a373",
    bg: "#181410",
  },
  10: {
    name: "Horror",
    movieInspiration: "Deep purples and blacks, eerie orange accents",
    accent: "#ff6f00",
    bg: "#0d0a14",
  },
  11: {
    name: "Family Adventure",
    movieInspiration: "Cozy amber and forest tones",
    accent: "#8d6e63",
    bg: "#14100c",
  },
  12: {
    name: "Holiday Classics",
    movieInspiration: "Festive red and evergreen, warm gold accents",
    accent: "#c62828",
    bg: "#0c1410",
  },
};

export function getThemeForMonth(date = new Date()) {
  const month = date.getMonth() + 1;
  return monthlyThemes[month];
}

export default monthlyThemes;
