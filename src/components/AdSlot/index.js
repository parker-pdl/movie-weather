import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

/*
 * Real Google AdSense banner slot (manual ad unit, not auto-ads).
 *
 * Manual, not auto-ads, on purpose: it lets the app hide ads for anyone
 * who buys "Remove Ads" (see src/components/RemoveAds) without touching
 * AdSense's site-wide settings. `active` is controlled by Home/index.js
 * based on the movieWeather.adsRemoved localStorage flag.
 *
 * TODO (Parker, one-time setup):
 *   1. In AdSense, add + get weather.parkerdata.link approved as a site
 *      on the pub-2328685696786328 account (ads.txt is already live at
 *      public/ads.txt, and the loader script is already in
 *      public/index.html).
 *   2. Once approved, create a manual "Display ad" unit for this app and
 *      copy its ad slot ID (a number, e.g. "1234567890").
 *   3. Paste that number into AD_SLOT_ID below and redeploy.
 * Until step 3 is done, this renders an empty reserved space -- no ad
 * request is made with a placeholder slot ID.
 */
const AD_SLOT_ID = 'REPLACE_WITH_ADSENSE_AD_SLOT_ID';
const AD_CLIENT_ID = 'ca-pub-2328685696786328';

class AdSlot extends PureComponent {
  componentDidMount() {
    if (!this.props.active || AD_SLOT_ID === 'REPLACE_WITH_ADSENSE_AD_SLOT_ID') {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense script not loaded yet / blocked -- fail silently, the
      // reserved space just stays empty instead of breaking the app.
    }
  }

  render() {
    if (!this.props.active) {
      return null;
    }

    if (AD_SLOT_ID === 'REPLACE_WITH_ADSENSE_AD_SLOT_ID') {
      // Reserved space, no ad requested yet -- see the TODO above.
      return <div className="AdSlot AdSlot--pending" aria-hidden="true" />;
    }

    return (
      <div className="AdSlot" id="movie-weather-ad-slot">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={AD_CLIENT_ID}
          data-ad-slot={AD_SLOT_ID}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }
}

AdSlot.propTypes = {
  active: PropTypes.bool,
};

AdSlot.defaultProps = {
  active: false,
};

export default AdSlot;
