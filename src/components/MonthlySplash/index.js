import React, { PureComponent } from 'react';
import Loader from '../Loader';
import monthlyThemes, { getPosterForMonth, getAudioForMonth } from '../../themes/monthlyThemes';
import './index.scss';

const AUDIO_PLAYED_KEY = 'movieWeather.audioPlayedDate';

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

class MonthlySplash extends PureComponent {
  constructor(props) {
    super(props);

    this.loader = React.createRef();
    this.audio = React.createRef();
    this.root = React.createRef();

    const now = new Date();
    const month = now.getMonth() + 1;

    this.theme = monthlyThemes[month] || {};
    this.month = month;
    this.state = { audioBlocked: false };
  }

  // Exposed so src/app/index.js can drive this the same way it drove <Loader>.
  animateIn() {
    if (this.loader.current) {
      this.loader.current.animateIn();
    }

    this.tryPlayAudioOnce();
  }

  animateOut() {
    if (this.root.current) {
      this.root.current.classList.add('monthly-splash--fade-out');
    }

    if (this.loader.current) {
      this.loader.current.animateOut();
    }

    this.fadeOutAudio();
  }

  tryPlayAudioOnce() {
    const alreadyPlayedToday = window.localStorage.getItem(AUDIO_PLAYED_KEY) === todayKey();

    if (alreadyPlayedToday || !this.audio.current) {
      return;
    }

    const playPromise = this.audio.current.play();

    if (playPromise && playPromise.then) {
      playPromise
        .then(() => {
          window.localStorage.setItem(AUDIO_PLAYED_KEY, todayKey());
        })
        .catch(() => {
          // Autoplay blocked by the browser until the user interacts -- not
          // an error, just skip silently and try again tomorrow.
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

    return (
      <div ref={this.root} className="monthly-splash" style={{ backgroundImage: `url(${poster})` }}>
        <div className="monthly-splash__scrim" />

        <audio ref={this.audio} src={audioSrc} preload="auto" />

        <div className="monthly-splash__content">
          {genre && <div className="monthly-splash__genre">{genre}</div>}
          {title && <div className="monthly-splash__title">{title}</div>}
          {tagline && <div className="monthly-splash__tagline">{tagline}</div>}
        </div>

        <Loader ref={this.loader} />
      </div>
    );
  }
}

export default MonthlySplash;
