// @flow

import type { Feature } from './types';

import React, { Component } from 'react';

function UnknownFeature({ query }) {
  return (
    <div
      style={{
        textAlign: 'center',
        opacity: 0.8,
        marginTop: '4rem',
      }}
    >
      <h3>Unknown Feature</h3>

      <h3>
        <code>{query}</code>
      </h3>
    </div>
  );
}

type SuggestionProps = {
  addFeatureToChecklist: Function,
  feature: Feature,
};

class Suggestion extends Component<SuggestionProps> {
  addFeatureToChecklist = () => {
    this.props.addFeatureToChecklist(this.props.feature);
  };

  render() {
    return (
      <tr className="suggestion" onClick={this.addFeatureToChecklist}>
        <td>{this.props.feature.title}</td>
        <td>{this.props.feature.description}</td>
      </tr>
    );
  }
}

type Props = {
  addFeatureToChecklist: Function,
  data: Array<Feature>,
  query: string,
};

class Suggestions extends Component<Props> {
  fuzzy(query: string) {
    const exactPattern = new RegExp(`^${query}$`, 'i');
    const beginPattern = new RegExp(`^${query}`, 'i');
    // const fuzzyPattern = new RegExp(query.split('').join('.*'), 'i');
    const fuzzyPattern = new RegExp(query, 'i');

    const allPatterns = [exactPattern, beginPattern, fuzzyPattern];

    const matches = new Set();
    allPatterns.forEach(pattern =>
      this.props.data.forEach(feature => {
        if (pattern.test(feature.title) || pattern.test(feature.description)) {
          matches.add(feature);
        }
      })
    );

    return Array.from(matches).slice(0, 10);
  }

  render() {
    if (this.props.query.length === 0) {
      return null;
    }

    const suggestions = this.fuzzy(this.props.query);

    if (suggestions.length === 0) {
      return <UnknownFeature query={this.props.query} />;
    }

    return [
      <div className="row table" key="suggestions">
        <div className="column column-80">
          <h2 style={{ textAlign: 'center' }}>Features</h2>

          <div
            style={{
              overflowY: 'auto',
              maxHeight: '60vh',
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {suggestions.map(feature => (
                  <Suggestion
                    addFeatureToChecklist={this.props.addFeatureToChecklist}
                    feature={feature}
                    key={feature.title}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>,

      <hr key="hr" />,
    ];
  }
}

export default Suggestions;
