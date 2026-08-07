import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

export const ADS_REMOVED_KEY = 'movieWeather.adsRemoved';
// Must exactly match the one-time in-app product ID Parker creates in the
// Google Play Console after the app is uploaded there (Play Console >
// Monetize > Products > In-app products > Create product > Product ID).
export const REMOVE_ADS_SKU = 'remove_ads';

/*
 * "Remove Ads" purchase button -- $0.99 one-time unlock.
 *
 * Only ever renders when the app is running as the installed Android app
 * (via the browser's Digital Goods API / Google Play Billing bridge).
 * On the plain website there is no Play Store to bill through, so this
 * intentionally shows nothing there -- free-with-ads is the only option
 * on the web version, same as before.
 *
 * TODO (Parker, one-time setup, after the Android package is uploaded):
 *   1. Play Console > your app > Monetize > Products > In-app products.
 *   2. Create a MANAGED product with Product ID exactly: remove_ads
 *      (must match REMOVE_ADS_SKU above).
 *   3. Set its price to $0.99 (Play's lowest allowed price) and activate it.
 *   4. When packaging with PWABuilder's "Google Play" option, make sure
 *      "Enable Play Billing" (Digital Goods API support) is turned on --
 *      it's off by default. Without it, this button just won't appear,
 *      same as on the web (harmless, just means ads stay on).
 */
class RemoveAds extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { available: false, price: null };
    this.onBuyClick = this.onBuyClick.bind(this);
  }

  async componentDidMount() {
    if (typeof window.getDigitalGoodsService !== 'function') {
      // Not running inside the Play-Billing-enabled Android app -- nothing
      // to do here, the free-with-ads web experience stays as-is.
      return;
    }

    try {
      const service = await window.getDigitalGoodsService('https://play.google.com/billing');
      const details = await service.getDetails([REMOVE_ADS_SKU]);

      if (details && details.length) {
        this.service = service;
        this.setState({ available: true, price: details[0].price });
      }
    } catch (e) {
      // Play Billing not available on this device/build -- fail silently.
    }
  }

  async onBuyClick() {
    try {
      const request = new PaymentRequest(
        [{ supportedMethods: 'https://play.google.com/billing', data: { sku: REMOVE_ADS_SKU } }],
        { total: { label: 'Remove Ads', amount: { currency: 'USD', value: '0.99' } } }
      );

      const response = await request.show();
      await response.complete('success');

      window.localStorage.setItem(ADS_REMOVED_KEY, 'true');

      if (this.props.onPurchased) {
        this.props.onPurchased();
      }
    } catch (e) {
      // User cancelled, or purchase failed -- no-op, ads stay on.
    }
  }

  render() {
    if (!this.state.available) {
      return null;
    }

    const priceLabel = (this.state.price && this.state.price.value) ? `$${this.state.price.value}` : '$0.99';

    return (
      <button type="button" className="RemoveAds" onClick={this.onBuyClick}>
        🎬 Remove Ads — {priceLabel}
      </button>
    );
  }
}

RemoveAds.propTypes = {
  onPurchased: PropTypes.func,
};

export default RemoveAds;
