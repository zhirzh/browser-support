/**
 * @flow
 * @prettier
 */

import type { Feature } from './types';

import React, { Component } from 'react';

type ChecklistItemProps = {
  feature: Feature,
  removeFeatureFromChecklist: Function,
};

/**
 * A button to remove a feature from user's feature checklist
 */
class ChecklistItem extends Component<ChecklistItemProps> {
  removeFeatureFromChecklist = () => {
    this.props.removeFeatureFromChecklist(this.props.feature);
  };

  render() {
    return (
      <div className="float-left checklist-item">
        <button
          className="button button-outline"
          onClick={this.removeFeatureFromChecklist}
          title="Click to remove feature"
        >
          {this.props.feature.title}
        </button>
      </div>
    );
  }
}

type Props = {
  checklist: Array<Feature>,
  removeFeatureFromChecklist: Function,
};

/**
 * Display user's selected features as pills (buttons)
 */
class Checklist extends Component<Props> {
  render() {
    return (
      <div className="row checklist">
        {this.props.checklist.map(feature => (
          <ChecklistItem
            feature={feature}
            key={feature.title}
            removeFeatureFromChecklist={this.props.removeFeatureFromChecklist}
          />
        ))}
      </div>
    );
  }
}

export default Checklist;
