import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import rAFTimeout from '../../helpers/rAFTimeout';
import Close from '../../components/Close';
import { displayTemperature } from '../../helpers/units';
import svg from '../../svg/github.svg';
import './index.scss';
import './transition.scss';

class Info extends PureComponent {
  constructor() {
    super();

    this.transition = React.createRef();
    this.view = React.createRef();
    this.close = React.createRef();
    this.searchInput = React.createRef();
    this.state = { query: '' };
    this.onInfoClose = this.onInfoClose.bind(this);
    this.onQueryChange = this.onQueryChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  onInfoClose() {
    rAFTimeout(() => this.view.current.classList.remove('animate-in'), 1);
    rAFTimeout(() => this.close.current.hide(), 20);
    rAFTimeout(() => this.transition.current.classList.remove('animate-in'), 100);
    rAFTimeout(() => {
      this.props.onInfoClose();
    }, 110);
  }

  onQueryChange(event) {
    this.setState({ query: event.target.value });
  }

  onSearchSubmit(event) {
    event.preventDefault();

    if (this.props.onSearchLocation) {
      this.props.onSearchLocation(this.state.query);
    }
  }

  getStyle(show) {
    if (!show) {
      return '';
    }

    rAFTimeout(() => this.transition.current.classList.add('animate-in'), 1);

    rAFTimeout(() => this.close.current.animate(), 50);

    rAFTimeout(() => {
      this.view.current.classList.remove('hide');
      this.view.current.classList.add('animate-in');
      this.view.current.setAttribute('aria-hidden', false);
    }, 150);

    return '';
  }

  renderDetails() {
    const c = this.props.currentCondition || {};
    const unit = this.props.unit || 'c';

    return (
      <Fragment>
        <h1>Details</h1>
        <ul className="details-list">
          <li>Feels like <span>{displayTemperature(c.feelsLike || 0, unit)}°{unit}</span></li>
          <li>Humidity <span>{c.humidity || 0}%</span></li>
          <li>Wind <span>{c.windSpeed || 0} km/h</span></li>
          <li>Cloud cover <span>{c.cloudCover || 0}%</span></li>
          <li>UV index <span>{c.uvIndex || 0}</span></li>
          <li>Sunrise <span>{c.sunrise || '--:--'}</span></li>
          <li>Sunset <span>{c.sunset || '--:--'}</span></li>
        </ul>
      </Fragment>
    );
  }

  renderSearch() {
    return (
      <form className="location-search" onSubmit={this.onSearchSubmit}>
        <label htmlFor="location-search-input">Change location</label>
        <input
          id="location-search-input"
          ref={this.searchInput}
          type="text"
          placeholder="Search a city..."
          value={this.state.query}
          onChange={this.onQueryChange} />
        <button type="submit">Go</button>
        {this.props.searchError && <p className="search-error">{this.props.searchError}</p>}
      </form>
    );
  }

  render() {
    return <Fragment>
      <div ref={this.transition} className="transition"></div>
      <section ref={this.view} className={`info ${this.getStyle(this.props.show)}`}>
        <Close ref={this.close} onCloseClick={this.onInfoClose} />
        {this.renderDetails()}
        {this.renderSearch()}
        <h1>About</h1>
        <p>Movie Weather -- a movie-themed weather PWA made with React/Scss/ES6</p>
        <h2>APIs</h2>
        <ul>
          <li>Weather &amp; forecast by <a className="link" href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a></li>
          <li>Location search by <a className="link" href="https://open-meteo.com/en/docs/geocoding-api" target="_blank" rel="noopener noreferrer">Open-Meteo Geocoding</a></li>
          <li><a className="link" href="https://www.bigdatacloud.com" target="_blank" rel="noopener noreferrer">BigDataCloud</a> (reverse geocoding for GPS location)</li>
          <li><a className="link" href="https://ipapi.co" target="_blank" rel="noopener noreferrer">ipapi.co</a> (initial IP-based location)</li>
        </ul>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/parker-pdl/movie-weather" className="github" title="Github">
          <img src={svg} alt="Github icon" width="32" height="32" />
        </a>
      </section>
    </Fragment>
  }
}

Info.propTypes = {
  show: PropTypes.bool,
  currentCondition: PropTypes.object,
  unit: PropTypes.string,
  onInfoClick: PropTypes.func,
  onInfoClose: PropTypes.func,
  onSearchLocation: PropTypes.func,
  searchError: PropTypes.string
};

export default Info;
