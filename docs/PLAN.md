# Movie Weather -- build plan

## Platforms

Platform 1, Web (parkerdatalink.com or its own domain): the source of truth. A static PWA, deployable to a Cloudflare Worker the same way the other Parker Data Link sites/apps are hosted (wrangler deploy).

Platform 2, Google Play Store: wrap the live web app with PWABuilder (https://pwabuilder.com) into a TWA, same method already used successfully for Classic Horror Movies and Classic Cartoons.

Platform 3, Amazon Appstore (Fire TV / Fire Tablet): same TWA build submitted to Amazon Developer Console, following the same Steps 1-4 flow already used for the other apps in this account. Note: Amazon no longer accepts new Android Mobile submissions (as of 2025-08-20) -- Fire TV/Tablet only, same constraint as the other apps in this project.

## Current state of this repo

This repo is a fork of iondrimba/react-weather-app (MIT licensed, React + Create React App). It ships a working PWA weather app now running entirely on free, keyless, open APIs: Open-Meteo for current/hourly/7-day forecast data, Open-Meteo Geocoding for manual location search, BigDataCloud for reverse-geocoding GPS coordinates to a place name, and ipapi.co for the initial IP-based location on first load. It previously depended on WeatherAPI.com plus ipify/KeyCDN; that layer has been fully replaced. The self-hosted local icon set (public/svg/day, public/svg/night) was kept as-is and is now driven by a WMO weather-code translation table (src/helpers/wmoIcons.js) instead of WeatherAPI's condition codes. The plan is to layer movie theming and multi-platform packaging on top of this existing, working foundation rather than rebuild from scratch.

Monthly theme config: src/themes/monthlyThemes.js -- one entry per calendar month (1-12), each with a name, movieInspiration note, and a color pair (accent / bg). Placeholder genre-based themes are filled in; swap for real design direction and specific per-month art/copy.

### Feature coverage vs. Parker's wishlist (this session)

Built: current weather (temp/humidity/wind/conditions), 7-day forecast data (5 days currently rendered -- see CSS constraint below), hourly forecast, auto-detect location via geolocation (GPS button) plus IP-based location on first load, manual location search (Info panel), Celsius/Fahrenheit toggle (tap the unit letter under the temperature), sunrise/sunset times, "feels like" temperature, cloud coverage, UV index, precipitation probability (already existed, kept), open-source weather icons (existing local set, reused).

Deliberately deferred (not built this session): severe weather alerts, radar map (Leaflet.js), air quality index, visibility, precipitation probability charts (chart UI, vs. the existing per-item percentages), multi-location favorites, dark/light mode, and all Premium/Future items (widgets, push notifications, storm tracking, historical weather data, travel mode). None of these had existing scaffolding to build on, so they were left out per the "only build what's missing" instruction rather than partially started.

### Known CSS constraint (relevant to any future 7-day-forecast work)

`.forecast` items are fixed at 58px wide, inside `.forecasts__scroll-panel` which is a fixed 342px with `overflow: hidden`. That panel comfortably fits ~5-6 items; the daily forecast API data now returns 7 days, but only 5 are rendered to avoid an unverified visual overflow/clipping bug. Expanding to a full 7-day display needs either a CSS width rework of `.forecasts__scroll-panel`/`.forecast`, or enabling horizontal scroll/swipe on that panel -- do this with visual verification (screenshot the built app), not blind.

## Still to do

Design and add real branded app icons (need a consistent logo mark that reads well at 512px and as a maskable icon). Fill in real per-month theme details in monthlyThemes.js (name, specific movie inspiration/franchise, background art, accent colors). Decide on a domain/path for the web version (subdomain of parkerdatalink.com, or its own site). Set up the Cloudflare Worker deploy for this repo. Once the web app is live, run it through pwabuilder.com to generate the Android package for Play Store and Amazon submission. Write screenshots and store descriptions for both app store listings once a build exists. Optionally revisit the deferred Advanced/Premium features above once the core app is live and Parker wants to prioritize any of them.

## Notes

Keep manual/account-level steps (domain DNS, Cloudflare deploy approval, store submissions) as explicit, simple, bulleted asks to Parker -- same pattern as the rest of this account's app-store work. Avoid using real movie titles, posters, or franchise names/art directly in shipped assets or copy -- treat movieInspiration notes as internal mood/design references only, to stay clear of trademark/copyright issues.
