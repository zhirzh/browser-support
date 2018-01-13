// @flow

import type { Feature } from './types';

import React, { Component } from 'react';

type ChecklistItemProps = {
  feature: Feature,
  removeFeatureFromChecklist: Function,
};

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
