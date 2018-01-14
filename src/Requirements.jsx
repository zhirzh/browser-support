// @flow

import type { Feature, Requirements as RequirementsType } from './types';

import React, { Component } from 'react';

const SUPPORT = {
  INIT: -2,
  NONE: -1,
  ALL: 0,
  NEXT: Infinity,
};

function EmptyRequirements() {
  return (
    <div
      style={{
        textAlign: 'center',
        opacity: 0.8,
        marginTop: '4rem',
      }}
    >
      <h3>No Requirements!!</h3>
      <h4>HUZZAH!!</h4>
    </div>
  );
}

type RequirementsTableProps = {
  requirements: RequirementsType,
};

class RequirementsTable extends Component<RequirementsTableProps> {
  parseVersion(version: number) {
    switch (version) {
      case SUPPORT.INIT:
      case SUPPORT.NONE:
        return 'None';

      case 0:
        return 'All';

      case SUPPORT.NEXT:
        return 'Next';

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
            <th>Partial Support</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(this.props.requirements).map(browser => {
            const browserData = this.props.requirements[browser];

            const noSupport =
              browserData.min === SUPPORT.NONE &&
              browserData.partial === SUPPORT.NONE;

            return (
              <tr key={browser} className={noSupport ? 'none' : ''}>
                <td>{browserCodes[browser]}</td>

                <td className={browserData.min === SUPPORT.NONE ? 'none' : ''}>
                  {this.parseVersion(browserData.min)}
                </td>

                <td
                  className={browserData.partial === SUPPORT.NONE ? 'none' : ''}
                >
                  {this.parseVersion(browserData.partial)}
                </td>
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

const browserCodes = {
  ie: 'IE',
  edge: 'Edge',
  firefox: 'Firefox',
  chrome: 'Chrome',
  safari: 'Safari',
  opera: 'Opera',
  ios_saf: 'iOS Safari',
  op_mini: 'Opera Mini',
  android: 'Android',
  bb: 'Blackberry',
  op_mob: 'Opera Mobile',
  and_chr: 'Chrome Android',
  and_ff: 'Firefox Android',
  ie_mob: 'IE Mobile',
  and_uc: 'UC for Android',
  samsung: 'Samsung Internet',
  and_qq: 'QQ',
  baidu: 'Baidu',
};

class Requirements extends Component<Props> {
  calculate(browser: string, versionSelector: Function) {
    /**
     * type browserVersion =
     *   | void
     *   | "TP"
     *   | "all"
     *   | number
     *
     * type requirementVersion =
     *   | "all"  : Array<browserVersion>.every(v => v === "all")
     *   | "none" : Array<browserVersion>.some(v => v === undefined)
     *   | "next" : Array<browserVersion>.some(v => v === "TP")
     *   | number : Array<browserVersion>.max()
     */

    let requirementVersion = SUPPORT.ALL;

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
        if (requirementVersion === SUPPORT.ALL) {
          requirementVersion = browserVersion;
        } else {
          requirementVersion = Math.max(
            requirementVersion,
            parseFloat(browserVersion)
          );
        }
      }
    }

    return requirementVersion;
  }

  calculateRequirements() {
    const requirements = {};

    Object.keys(this.props.browsers).forEach(browser => {
      requirements[browser] = {
        min: this.calculate(browser, x => x === 'y'),
        partial: this.calculate(browser, x => x.startsWith('a')),
      };
    });

    return requirements;
  }

  render() {
    const requirements = this.calculateRequirements();
    const hasRequirements = Object.keys(requirements).length > 0;

    return (
      <div className="row table">
        <div className="column column-40">
          <h2 style={{ textAlign: 'center' }}>Browser Requirements</h2>

          {hasRequirements ? (
            <RequirementsTable requirements={requirements} />
          ) : (
            <EmptyRequirements />
          )}
        </div>
      </div>
    );
  }
}

export default Requirements;
