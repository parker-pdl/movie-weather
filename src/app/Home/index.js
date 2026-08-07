import React, { PureComponent, Fragment } from 'react';
import Swiper from 'swiper';
import ForecastHourly from '../../components/ForecastHourly';
import ForecastDaily from '../../components/ForecastDaily';
import Location from '../../components/Location';
import Temperature from '../../components/Temperature';
import Navigation from '../../components/Navigation';
import GPSLocation from '../../components/GPSLocation';
import Info from '../../components/Info';
import DateCurrent from '../../components/DateCurrent';
import Refresh from '../../components/Refresh';
import AdSlot from '../../components/AdSlot';
import RemoveAds, { ADS_REMOVED_KEY } from '../../components/RemoveAds';
import PropTypes from 'prop-types';
import { displayTemperature } from '../../helpers/units';
import monthlyThemes from '../../themes/monthlyThemes';

const LOCATION_HINT_DISMISSED_KEY = 'movieWeather.locationHintDismissed';

const currentMonth = new Date().getMonth() + 1;
const currentTheme = monthlyThemes[currentMonth] || {};

class Home extends PureComponent {
  constructor() {
    super();

    this.state = {
      currentForecast: 'hourly',
      forecastIndex: ['hourly', 'daily'],
      locationHintDismissed: window.localStorage.getItem(LOCATION_HINT_DISMISSED_KEY) === 'true',
      // Free-with-ads by default; flips to true forever on this device once
      // the $0.99 "Remove Ads" in-app purchase completes (RemoveAds writes
      // this same localStorage key -- see components/RemoveAds).
      adsRemoved: window.localStorage.getItem(ADS_REMOVED_KEY) === 'true',
    };

    this.onDismissLocationHint = this.onDismissLocationHint.bind(this);
    this.onAdsRemoved = this.onAdsRemoved.bind(this);
  }

  onDismissLocationHint() {
    window.localStorage.setItem(LOCATION_HINT_DISMISSED_KEY, 'true');
    this.setState({ locationHintDismissed: true });
  }

  onAdsRemoved() {
    this.setState({ adsRemoved: true });
  }

  componentDidMount() {
    this.forecasts = [...document.querySelectorAll('.forecasts__period')];

    this.swiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      loop: false
    });

    this.swiper.on('slideChangeTransitionEnd', () => {
      this.setState({ currentForecast: this.state.forecastIndex[this.swiper.activeIndex] });
    });
  }

  render() {
    const unit = this.props.unit;

    const foreCastHourly = this.props.foreCastHourly.map((item) => ({
      ...item,
      temperature: displayTemperature(item.temperature, unit),
    }));

    const foreCastDaily = this.props.foreCastDaily.map((item) => ({
      ...item,
      temperature: {
        max: displayTemperature(item.temperature.max, unit),
        min: displayTemperature(item.temperature.min, unit),
      },
    }));

    return <Fragment>
      <GPSLocation onGPSLocationClick={this.props.onGPSLocationClick} />
      <Info onInfoClick={this.props.onInfoClick} onInfoClose={this.props.onInfoClose} />
      {
        // A small theater-marquee style header, tying the weather screen
        // back to the same monthly movie theme the splash just showed --
        // otherwise Home was just a plain weather UI with no movie identity
        // of its own once the splash faded out.
        currentTheme.title && (
          <div className="Home__marquee">
            <span className="Home__marquee-dot" aria-hidden="true" />
            <span className="Home__marquee-text">Now Screening &middot; {currentTheme.title}</span>
            <span className="Home__marquee-dot" aria-hidden="true" />
          </div>
        )
      }
      <Location location={this.props.currentCondition.location} />
      <DateCurrent date={this.props.currentCondition.date} />
      <Temperature weather={this.props.currentCondition.weather} temperature={displayTemperature(this.props.currentCondition.temperature, unit)} unit={unit} onUnitToggle={this.props.onUnitToggle} />
      <Refresh onClick={this.props.onRefreshClick} updating={this.props.updating} time={this.props.lastUpdate} />
      <section className="forecasts">
        <div className="forecasts__scroll-panel swiper-container">
          <div className="swiper-wrapper">
            <ForecastHourly foreCastHourly={foreCastHourly} />
            <ForecastDaily foreCastDaily={foreCastDaily} />
          </div>
        </div>
        <Navigation currentForecast={this.state.currentForecast} />
      </section>
      {
        // position: absolute (see src/app/index.scss) so it doesn't join
        // .App's flex space-between distribution and shift Location /
        // Temperature / the forecast section -- that's what caused the
        // date/location overlap the marquee introduced.
        !this.state.locationHintDismissed && (
          <button type="button" className="Home__location-hint" onClick={this.onDismissLocationHint}>
            📍 Local forecasts need your location — tap the crosshair above anytime to update it. Tap to dismiss.
          </button>
        )
      }
      {
        // Free-with-ads by default. Renders nothing once the $0.99
        // "Remove Ads" purchase has happened on this device (adsRemoved),
        // or until the AdSense ad unit ID is filled in -- see
        // src/components/AdSlot/index.js.
      }
      <AdSlot active={!this.state.adsRemoved} />
      {
        // Only ever renders inside the installed Android app (Play
        // Billing) -- see src/components/RemoveAds/index.js. No-op on the
        // plain website.
      }
      {
        !this.state.adsRemoved && <RemoveAds onPurchased={this.onAdsRemoved} />
      }
    </Fragment>
  }
}

Home.propTypes = {
  foreCastHourly: PropTypes.array,
  foreCastDaily: PropTypes.array,
  updating: PropTypes.bool,
  lastUpdate: PropTypes.string,
  currentCondition: PropTypes.object,
  unit: PropTypes.string,
  onGPSLocationClick: PropTypes.func,
  onInfoClick: PropTypes.func,
  onInfoClose: PropTypes.func,
  onRefreshClick: PropTypes.func,
  onUnitToggle: PropTypes.func
};

export default Home;
