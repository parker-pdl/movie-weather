import React, { PureComponent } from 'react';
import monthlyThemes, { getPosterForMonth } from '../../themes/monthlyThemes';
import getQuoteForDate from '../../data/dailyQuote';
import './index.scss';

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

class MonthlySplash extends PureComponent {
  constructor(props) {
    super(props);

    this.root = React.createRef();

    const now = new Date();
    const month = now.getMonth() + 1;

    this.theme = monthlyThemes[month] || {};
    this.month = month;
    this.quote = getQuoteForDate(now);
    this.state = { phase: 'poster' };
  }

  componentWillUnmount() {
    clearTimeout(this.posterTimer);
  }

  // Exposed so src/app/index.js can drive this the same way it drove <Loader>.
  animateIn() {
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

    // Theme music now lives at the App level and keeps looping past the
    // splash, so there's nothing audio-related to fade out here anymore.
  }

  render() {
    const { title, genre, tagline } = this.theme;
    const poster = getPosterForMonth(this.month);
    const showingQuote = this.state.phase === 'quote';

    return (
      <div ref={this.root} className="monthly-splash">
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
      </div>
    );
  }
}

export default MonthlySplash;
