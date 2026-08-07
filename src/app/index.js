import React, { Component, Fragment } from 'react';
import Home from './Home';
import Info from './Info';
import MonthlySplash, { TOTAL_SPLASH_MS } from '../components/MonthlySplash';
import Error from '../components/Error';
import rAFTimeout from '../helpers/rAFTimeout';
import Storage from './storage';
import './index.scss';

class App extends Component {
  constructor() {
    super();

    this.loader = React.createRef();
    this.onInfoClick = this.onInfoClick.bind(this);
    this.onInfoClose = this.onInfoClose.bind(this);
    this.onRefreshClick = this.onRefreshClick.bind(this);
    this.onGPSLocationClick = this.onGPSLocationClick.bind(this);
    this.onUnitToggle = this.onUnitToggle.bind(this);
    this.onSearchLocation = this.onSearchLocation.bind(this);

    this.storage = new Storage();
    this.state = { ...this.storage.data };
  }

  async init() {
    rAFTimeout(() => this.loader.current.animateIn(), 100);

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
      <div className="App">
        <div className="App__watermark" aria-hidden="true" style={{ backgroundImage: 'url(/brand-watermark.png)' }} />
        {
          !this.state.dataLoaded ? <MonthlySplash ref={this.loader} /> : this.display()
        }
      </div>
    );
  }
}

export default App;
