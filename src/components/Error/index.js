import React, { PureComponent } from 'react';
import './index.scss';

class Error extends PureComponent {
  render() {
    return (
      <div className="error">
        <h1>:(</h1>
        This app uses free weather and location services, and one of them is temporarily unavailable or over its usage limit.<br /><br />Please try refreshing in a moment.
      </div>
    )
  }
}

export default Error;
