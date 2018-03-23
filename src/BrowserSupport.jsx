/**
 * @flow
 * @prettier
 */

import type { Feature, Support } from './types';

import React, { Component } from 'react';

const SUPPORT = {
  NONE: -1,
  ALL: 0,
  NEXT: Infinity,
};

type BrowserSupportTableProps = {
  browserNames: {
    [string]: string,
  },
  browserSupport: Support,
};

/**
 * The support table
 */
class BrowserSupportTable extends Component<BrowserSupportTableProps> {
  parseVersion(version: number | string) {
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
          {Object.keys(this.props.browserSupport).map(browserCode => {
            const browserData = this.props.browserSupport[browserCode];

            const notSupported = browserData.full === SUPPORT.NONE;

            return (
              <tr
                key={browserCode}
                className={notSupported ? 'not-supported' : ''}
              >
                <td>{this.props.browserNames[browserCode]}</td>

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
  browsers: {
    [string]: string,
  },
  checklist: Array<Feature>,
};

/**
 * Renders the support table
 */
class BrowserSupport extends Component<Props> {
  calculate(browserCode: string, versionSelector: Function) {
    /**
     * type browserVersion =
     *   | void
     *   | "TP"
     *   | "all"
     *   | number
     *   | number-number
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

      const browserData = feature.stats[browserCode];

      const browserVersion = Object.keys(browserData).find(version =>
        versionSelector(browserData[version])
      );

      if (browserVersion === undefined) {
        return SUPPORT.NONE;
      }

      if (browserVersion.match(/\d-\d/)) {
        return browserVersion.split('-')[1];
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

    Object.keys(this.props.browsers).forEach(browserCode => {
      browserSupport[browserCode] = {
        full: this.calculate(browserCode, x => x === 'y'),
      };
    });

    return browserSupport;
  }

  render() {
    if (this.props.checklist.length === 0) {
      return (
        <h4
          style={{
            textAlign: 'center',
            opacity: 0.8,
          }}
        >
          Select Features to Calculate Browser Support
        </h4>
      );
    }

    const browserSupport = this.calculateBrowserSupport();

    return (
      <div className="row table">
        <div className="column column-40">
          <BrowserSupportTable
            browserNames={this.props.browsers}
            browserSupport={browserSupport}
          />
        </div>
      </div>
    );
  }
}

export default BrowserSupport;
