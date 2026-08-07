import React, { PureComponent } from 'react';
import monthlyThemes, { getPosterForMonth, getAudioForMonth } from '../../themes/monthlyThemes';
import getQuoteForDate from '../../data/dailyQuote';
import './index.scss';

const AUDIO_PLAYED_KEY = 'movieWeather.audioPlayedDate';

// Poster is on screen this long before crossfading to black + the quote.
export const POSTER_DURATION_MS = 4000;
// How long the poster-to-black crossfade itself takes (CSS transition, kept
// in sync with index.scss's $crossfade-duration).
export const CROSSFADE_MS = 900;
// How long the quote stays fully visible on black before src/app/index.js
// is expected to call animateOut().
export const QUOTE_HOLD_MS = 5000;
// Total recommended minimum splash time -- src/app/index.js waits at least
// this long (in addition to the weather fetch) before dismissing the splash,
// so the poster and the quote both get real screen time.
export const TOTAL_SPLASH_MS = POSTER_DURATION_MS + CROSSFADE_MS + QUOTE_HOLD_MS;

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

class MonthlySplash extends PureComponent {
  constructor(props) {
    super(props);

    this.audio = React.createRef();
    this.root = React.createRef();

    const now = new Date();
    const month = now.getMonth() + 1;

    this.theme = monthlyThemes[month] || {};
    this.month = month;
    this.quote = getQuoteForDate(now);
    this.state = { audioBlocked: false, phase: 'poster' };
  }

  componentWillUnmount() {
    clearTimeout(this.posterTimer);
  }

  // Exposed so src/app/index.js can drive this the same way it drove <Loader>.
  animateIn() {
    this.tryPlayAudioOnce();

    // Poster holds for POSTER_DURATION_MS, then crossfades to black with the
    // day's quote fading in on top of it.
    this.posterTimer = setTimeout(() => {
      this.setState({ phase: 'quote' });
    }, POSTER_DURATION_MS);
  }

  animateOut() {
    if (this.root.current) {
      this.root.current.classList.add('monthly-splash--fade-out');
    }

    this.fadeOutAudio();
  }

  tryPlayAudioOnce(userInitiated = false) {
    const alreadyPlayedToday = window.localStorage.getItem(AUDIO_PLAYED_KEY) === todayKey();

    // A direct tap on the splash is a real user gesture and should always be
    // allowed to (re)try playback, even if the silent auto-attempt already
    // ran once today -- that's the whole point of the "Tap for sound" hint.
    if ((alreadyPlayedToday && !userInitiated) || !this.audio.current) {
      return;
    }

    const playPromise = this.audio.current.play();

    if (playPromise && playPromise.then) {
      playPromise
        .then(() => {
          window.localStorage.setItem(AUDIO_PLAYED_KEY, todayKey());
          this.setState({ audioBlocked: false });
        })
        .catch(() => {
          // Most browsers block audio-with-sound from autoplaying until the
          // user has interacted with the page at least once. That's not an
          // error -- show the "Tap for sound" hint so the click handler on
          // the splash can retry with a real user gesture attached.
          this.setState({ audioBlocked: true });
        });
    }
  }

  fadeOutAudio() {
    const audioEl = this.audio.current;

    if (!audioEl || audioEl.paused) {
      return;
    }

    const fadeStep = 0.08;
    const fadeInterval = setInterval(() => {
      if (audioEl.volume - fadeStep <= 0) {
        audioEl.pause();
        clearInterval(fadeInterval);
      } else {
        audioEl.volume -= fadeStep;
      }
    }, 60);
  }

  render() {
    const { title, genre, tagline } = this.theme;
    const poster = getPosterForMonth(this.month);
    const audioSrc = getAudioForMonth(this.month);
    const showingQuote = this.state.phase === 'quote';

    return (
      <div
        ref={this.root}
        className="monthly-splash"
        onClick={() => this.tryPlayAudioOnce(true)}
      >
        <div
          className={
            'monthly-splash__poster' +
            (showingQuote ? ' monthly-splash__poster--hidden' : '')
          }
          style={{ backgroundImage: `url(${poster})` }}
        >
          <div className="monthly-splash__scrim" />

          <div className="monthly-splash__content">
            {genre && <div className="monthly-splash__genre">{genre}</div>}
            {title && <div className="monthly-splash__title">{title}</div>}
            {tagline && <div className="monthly-splash__tagline">{tagline}</div>}
          </div>
        </div>

        {this.quote && (
          <div
            className={
              'monthly-splash__quote' +
              (showingQuote ? ' monthly-splash__quote--visible' : '')
            }
          >
            <div className="monthly-splash__quote-mark">&ldquo;</div>
            <div className="monthly-splash__quote-text">{this.quote}</div>
          </div>
        )}

        {/* Rendered at the root (not inside the poster layer) so it stays on
            screen through BOTH the poster and quote phases -- otherwise it
            was disappearing after 4s when the poster faded out, well before
            the splash actually ended. */}
        {this.state.audioBlocked && (
          <div className="monthly-splash__sound-hint">🔊 Tap screen for music</div>
        )}

        <audio ref={this.audio} src={audioSrc} preload="auto" />
      </div>
    );
  }
}

export default MonthlySplash;
