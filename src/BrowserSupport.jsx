// @flow

import type { Feature, Support } from './types';

import React, { Component } from 'react';

const SUPPORT = {
  NONE: -1,
  ALL: 0,
  NEXT: Infinity,
};

function EmptySupport() {
  return (
    <div
      style={{
        textAlign: 'center',
        opacity: 0.8,
        marginTop: '4rem',
      }}
    >
      <h3>No Support!!</h3>
      <h4>HUZZAH!!</h4>
    </div>
  );
}

type BrowserSupportTableProps = {
  browserNames: Object,
  browserSupport: Support,
};

class BrowserSupportTable extends Component<BrowserSupportTableProps> {
  parseVersion(version: number) {
    switch (version) {
      case SUPPORT.NONE:
        return <i>None</i>;

      case 0:
        return <b>All</b>;

      case SUPPORT.NEXT:
        return <i>Next</i>;

      default:
        return version;
    }
  }

  render() {
    return (
      <table>
        <caption />

        <thead>
          <tr>
            <th>Browser</th>
            <th>Full Support</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(this.props.browserSupport).map(browser => {
            const browserData = this.props.browserSupport[browser];

            const notSupported = browserData.full === SUPPORT.NONE;

            return (
              <tr key={browser} className={notSupported ? 'not-supported' : ''}>
                <td>{this.props.browserNames[browser].browser}</td>

                <td>{this.parseVersion(browserData.full)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

type Props = {
  browsers: Object,
  checklist: Array<Feature>,
};

class BrowserSupport extends Component<Props> {
  calculate(browser: string, versionSelector: Function) {
    /**
     * type browserVersion =
     *   | void
     *   | "TP"
     *   | "all"
     *   | number
     *
     * type supportVersion =
     *   | "all"  : Array<browserVersion>.every(v => v === "all")
     *   | "none" : Array<browserVersion>.some(v => v === undefined)
     *   | "next" : Array<browserVersion>.some(v => v === "TP")
     *   | number : Array<browserVersion>.max()
     */

    let supportVersion = SUPPORT.ALL;

    for (let i = 0; i < this.props.checklist.length; i++) {
      const feature = this.props.checklist[i];

      const browserData = feature.stats[browser];

      const browserVersion = Object.keys(browserData).find(version =>
        versionSelector(browserData[version])
      );

      if (browserVersion === undefined) {
        return SUPPORT.NONE;
      }

      if (browserVersion.toLowerCase() === 'tp') {
        return SUPPORT.NEXT;
      }

      if (browserVersion.toLowerCase() !== 'all') {
        if (supportVersion === SUPPORT.ALL) {
          supportVersion = browserVersion;
        } else {
          supportVersion = Math.max(supportVersion, parseFloat(browserVersion));
        }
      }
    }

    return supportVersion;
  }

  calculateBrowserSupport() {
    const browserSupport = {};

    Object.keys(this.props.browsers).forEach(browser => {
      browserSupport[browser] = {
        full: this.calculate(browser, x => x === 'y'),
      };
    });

    return browserSupport;
  }

  render() {
    const browserSupport = this.calculateBrowserSupport();
    const hasSupport = Object.keys(browserSupport).length > 0;

    const browserNames = {};
    Object.keys(this.props.browsers).forEach(browser => {
      browserNames[browser] = this.props.browsers[browser];
    });

    return (
      <div className="row table">
        <div className="column column-40">
          <h2 style={{ textAlign: 'center' }}>Browser Support</h2>

          {hasSupport ? (
            <BrowserSupportTable
              browserNames={browserNames}
              browserSupport={browserSupport}
            />
          ) : (
            <EmptySupport />
          )}
        </div>
      </div>
    );
  }
}

export default BrowserSupport;
