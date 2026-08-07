import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

/*
 * Placeholder ad slot -- future use.
 *
 * Parker plans to add in-app ads later (same ad networks used on the
 * Hostinger sites, e.g. AdSense/PropellerAds/Infolinks). Rather than bolt
 * that in later and risk breaking the layout again, this reserves a safe,
 * fixed spot for a banner-style ad unit that:
 *   - sits in a corner that's already proven not to collide with the
 *     weather data (see the Home__marquee / Home__location-hint /
 *     App__watermark layout notes in src/app/index.scss -- those all had
 *     to be pulled out of normal document flow because .App is a flex
 *     column with justify-content: space-between, and this component
 *     follows that same pattern from the start)
 *   - renders NOTHING by default (`active` prop defaults to false), so it
 *     has zero effect on the app until Parker actually has an ad network
 *     script/unit ready to drop in
 *
 * To turn it on:
 *   1. Paste the ad network's site-verification/loader script tag into
 *      public/index.html (see the comment there).
 *   2. Pass `active` (and the ad unit's own markup/script as children,
 *      or swap the body of render() for that network's React component)
 *      to <AdSlot> where it's rendered in src/app/Home/index.js.
 */
class AdSlot extends PureComponent {
  render() {
    if (!this.props.active) {
      return null;
    }

    return (
      <div className="AdSlot" id="movie-weather-ad-slot" data-ad-slot={this.props.slotId || 'default'}>
        {this.props.children}
      </div>
    );
  }
}

AdSlot.propTypes = {
  active: PropTypes.bool,
  slotId: PropTypes.string,
  children: PropTypes.node,
};

AdSlot.defaultProps = {
  active: false,
};

export default AdSlot;
