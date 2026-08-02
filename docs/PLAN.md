# Movie Weather -- build plan

## Platforms

Platform 1, Web (parkerdatalink.com or its own domain): the source of truth. A static PWA, deployable to a Cloudflare Worker the same way the other Parker Data Link sites/apps are hosted (wrangler deploy).

Platform 2, Google Play Store: wrap the live web app with PWABuilder (https://pwabuilder.com) into a TWA, same method already used successfully for Classic Horror Movies and Classic Cartoons.

Platform 3, Amazon Appstore (Fire TV / Fire Tablet): same TWA build submitted to Amazon Developer Console, following the same Steps 1-4 flow already used for the other apps in this account. Note: Amazon no longer accepts new Android Mobile submissions (as of 2025-08-20) -- Fire TV/Tablet only, same constraint as the other apps in this project.

## Current state of this repo

This repo is a fork of iondrimba/react-weather-app (MIT licensed, React + Create React App). It already ships a working PWA weather app using WeatherAPI.com for forecasts, plus ipify.org and KeyCDN for IP-based geolocation. The plan is to layer movie theming and multi-platform packaging on top of this existing, working foundation rather than rebuild from scratch.

Monthly theme config: src/themes/monthlyThemes.js -- one entry per calendar month (1-12), each with a name, movieInspiration note, and a color pair (accent / bg). Placeholder genre-based themes are filled in; swap for real design direction and specific per-month art/copy.

## Still to do

Design and add real branded app icons (need a consistent logo mark that reads well at 512px and as a maskable icon). Fill in real per-month theme details in monthlyThemes.js (name, specific movie inspiration/franchise, background art, accent colors). Decide on a domain/path for the web version (subdomain of parkerdatalink.com, or its own site). Set up the Cloudflare Worker deploy for this repo. Once the web app is live, run it through pwabuilder.com to generate the Android package for Play Store and Amazon submission. Write screenshots and store descriptions for both app store listings once a build exists.

## Notes

Keep manual/account-level steps (domain DNS, Cloudflare deploy approval, store submissions) as explicit, simple, bulleted asks to Parker -- same pattern as the rest of this account's app-store work. Avoid using real movie titles, posters, or franchise names/art directly in shipped assets or copy -- treat movieInspiration notes as internal mood/design references only, to stay clear of trademark/copyright issues.
