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
import PropTypes from 'prop-types';
import { displayTemperature } from '../../helpers/units';

class Home extends PureComponent {
  constructor() {
    super();

    this.state = {
      currentForecast: 'hourly',
      forecastIndex: ['hourly', 'daily'],
    };
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
