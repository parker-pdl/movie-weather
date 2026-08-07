import React, { Component, Fragment } from 'react';
import Home from './Home';
import Info from './Info';
import MonthlySplash, { TOTAL_SPLASH_MS } from '../components/MonthlySplash';
import Error from '../components/Error';
import rAFTimeout from '../helpers/rAFTimeout';
import Storage from './storage';
import monthlyThemes, { getPosterForMonth, getAudioForMonth } from '../themes/monthlyThemes';
import './index.scss';

const AUDIO_PLAYED_KEY = 'movieWeather.audioPlayedDate';

function hexToRgbString(hex, fallback = '10, 14, 26') {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');

  if (!match) {
    return fallback;
  }

  const [, r, g, b] = match;
  return `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`;
}

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const currentMonth = new Date().getMonth() + 1;
const currentTheme = monthlyThemes[currentMonth] || {};
const backdropPoster = getPosterForMonth(currentMonth);
const themeAudioSrc = getAudioForMonth(currentMonth);
const moodBgRgb = hexToRgbString(currentTheme.bg);

class App extends Component {
  constructor() {
    super();

    this.loader = React.createRef();
    this.audio = React.createRef();
    this.onInfoClick = this.onInfoClick.bind(this);
    this.onInfoClose = this.onInfoClose.bind(this);
    this.onRefreshClick = this.onRefreshClick.bind(this);
    this.onGPSLocationClick = this.onGPSLocationClick.bind(this);
    this.onUnitToggle = this.onUnitToggle.bind(this);
    this.onSearchLocation = this.onSearchLocation.bind(this);
    this.onAppClick = this.onAppClick.bind(this);

    this.storage = new Storage();
    this.state = { ...this.storage.data, audioBlocked: false };
  }

  // The theme music lives here at the App level (not inside <MonthlySplash>)
  // so it keeps looping for as long as the app is open, instead of stopping
  // when the splash unmounts. `loop` on the <audio> tag handles the repeat.
  tryPlayAudioOnce(userInitiated = false) {
    const alreadyPlayedToday = window.localStorage.getItem(AUDIO_PLAYED_KEY) === todayKey();

    // A direct tap anywhere in the app is a real user gesture and should
    // always be allowed to (re)try playback, even if the silent
    // auto-attempt already ran once today.
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
          // error -- show the "Tap for sound" hint so a real tap anywhere in
          // the app can retry with a genuine user gesture attached.
          this.setState({ audioBlocked: true });
        });
    }
  }

  onAppClick() {
    this.tryPlayAudioOnce(true);
  }

  async init() {
    rAFTimeout(() => this.loader.current.animateIn(), 100);
    this.tryPlayAudioOnce();

    // The monthly splash (poster + theme music + daily quote) should get
    // real screen time regardless of how fast the weather fetch comes back
    // -- on a fast connection the fetch alone was resolving in a few
    // hundred ms, so the poster/quote barely had a chance to show before
    // fading out. Wait for BOTH the fetch and the full splash sequence
    // (poster hold + crossfade + quote hold) before starting the fade-out.
    const minSplashTimer = new Promise((resolve) => setTimeout(resolve, TOTAL_SPLASH_MS));

    await Promise.all([this.storage.fetch(), minSplashTimer]);

    rAFTimeout(() => {
      this.loader.current.animateOut();

      rAFTimeout(() => this.updatedState(), 600);
    }, 1000);
  }

  updatedState() {
    if (this.storage.data.error) {
      this.setState({
        error: this.storage.data.error,
        dataLoaded: true,
      });
    } else {
      this.setState({
        ...this.storage.data,
        showInfo: false,
        dataLoaded: true,
        updating: false,
      });
    }
  }

  onGPSLocationClick() {
    if (!this.state.updating && navigator.geolocation) {
      this.setState({ updating: true });

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await this.storage.getCurrentPosition(position.coords.latitude, position.coords.longitude);
          this.updatedState();
        },
        async () => {
          // Permission denied or unavailable -- keep whatever is on screen.
          this.setState({ updating: false });
        }
      );
    }
  }

  async onRefreshClick() {
    if (!this.state.updating) {
      this.setState({ updating: true });

      await this.storage.refresh();
      this.updatedState();
    }
  }

  async onSearchLocation(query) {
    if (!query || !query.trim()) {
      return;
    }

    this.setState({ updating: true });

    try {
      await this.storage.search(query.trim());
      this.updatedState();
    } catch (error) {
      this.setState({ updating: false, searchError: error.message });
    }
  }

  onUnitToggle() {
    const unit = this.storage.toggleUnit();

    this.setState({ unit });
  }

  onInfoClick() {
    this.setState({ showInfo: true });
  }

  onInfoClose() {
    this.setState({ showInfo: false });
  }

  componentDidMount() {
    this.init();
  }

  errorReachLimit() {
    return <Error/>
  }

  display() {
    return (this.state.error ? this.errorReachLimit() : this.displayHome());
  }

  displayHome() {
    return (
      <Fragment>
        <Home currentCondition={this.state.currentCondition}
          foreCastDaily={this.state.foreCastDaily}
          foreCastHourly={this.state.foreCastHourly}
          unit={this.state.unit}
          onInfoClick={this.onInfoClick}
          onGPSLocationClick={this.onGPSLocationClick}
          onUnitToggle={this.onUnitToggle}
          updating={this.state.updating}
          lastUpdate={this.state.lastUpdate}
          onRefreshClick={this.onRefreshClick} />
        <Info onInfoClose={this.onInfoClose}
          show={this.state.showInfo}
          currentCondition={this.state.currentCondition}
          unit={this.state.unit}
          onSearchLocation={this.onSearchLocation}
          searchError={this.state.searchError} />
      </Fragment>
    )
  }

  render() {
    return (
      <div
        className="App"
        onClick={this.onAppClick}
        style={{
          '--app-accent': currentTheme.accent || '#297af9',
          '--app-mood-bg-rgb': moodBgRgb,
        }}
      >
        {
          // A softened, darkened backdrop of this month's poster -- gives the
          // whole app (not just the splash) a movie-backdrop feel instead of
          // the flat solid-blue background. Hidden while the splash itself is
          // showing since the splash already displays the poster at full
          // strength.
          this.state.dataLoaded && (
            <div
              className="App__backdrop"
              aria-hidden="true"
              style={{ backgroundImage: `url(${backdropPoster})` }}
            />
          )
        }
        <div className="App__vignette" aria-hidden="true" />
        <div className="App__grain" aria-hidden="true" />
        <div className="App__watermark" aria-hidden="true" style={{ backgroundImage: 'url(/brand-watermark.png)' }} />
        {
          // Lives here (not inside MonthlySplash) so it survives the splash
          // unmounting and keeps looping the whole time the app is open.
        }
        <audio ref={this.audio} src={themeAudioSrc} loop preload="auto" />
        {
          // Visible whenever autoplay got blocked, whether we're still on
          // the splash or already on the weather screen -- any tap anywhere
          // in the app (see onAppClick) will retry playback.
          this.state.audioBlocked && (
            <div className="App__sound-hint" aria-hidden="true">🔊 Tap for music</div>
          )
        }
        {
          !this.state.dataLoaded ? <MonthlySplash ref={this.loader} /> : this.display()
        }
      </div>
    );
  }
}

export default App;
