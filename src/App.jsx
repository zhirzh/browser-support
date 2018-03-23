/**
 * @flow
 * @prettier
 */

import type { Feature } from './types';

import React, { Component } from 'react';

import BrowserSupport from './BrowserSupport';
import Checklist from './Checklist';
import Suggestions from './Suggestions';

function Loading() {
  return (
    <div>
      <div className="loading" />
      <h4 style={{ textAlign: 'center' }}>Loading Data</h4>
      <div className="loading" />
    </div>
  );
}

type State = {
  browsers: {
    [string]: string,
  },
  checklist: Array<Feature>,
  data: Array<Feature>,
  query: string,
};

class App extends Component<{}, State> {
  state = {
    browsers: {},
    checklist: [],
    data: [],
    query: '',
  };

  async componentDidMount() {
    await this.fetchData();
    this.loadChecklistFromURL();
  }

  componentDidUpdate(_: any, prevState: State) {
    if (this.state.checklist !== prevState.checklist) {
      this.syncChecklistToURL();
    }
  }

  addFeatureToChecklist = (feature: Feature) => {
    if (this.state.checklist.includes(feature)) {
      alert('Already added');

      return;
    }

    this.setState({
      ...this.state,

      checklist: [...this.state.checklist, feature],
      query: '',
    });
  };

  async fetchData() {
    const resp = await fetch(
      'https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json'
    );

    const caniuse = await resp.json();

    const browsers = Object.keys(caniuse.agents).reduce(
      (_browsers, browserCode) => {
        _browsers[browserCode] = caniuse.agents[browserCode].browser;

        return _browsers;
      },
      {}
    );

    const data = Object.keys(caniuse.data).map(k => {
      const data = caniuse.data[k];
      data.code = k;

      return data;
    });

    this.setState({
      browsers,
      data,
    });
  }

  loadChecklistFromURL() {
    const checklistCodes = new URLSearchParams(window.location.search).get(
      'checklist'
    );

    if (checklistCodes === null) {
      this.syncChecklistToURL();
      return;
    }

    const checklist = checklistCodes
      .split(',')
      .map(code => this.state.data.find(feature => feature.code === code))
      .filter(Boolean);

    this.setState({ checklist });
  }

  removeFeatureFromChecklist = (feature: Feature) => {
    const idx = this.state.checklist.findIndex(x => x === feature);

    this.setState({
      ...this.state,

      checklist: [
        ...this.state.checklist.slice(0, idx),
        ...this.state.checklist.slice(idx + 1),
      ],
    });
  };

  syncChecklistToURL() {
    const checklistCodes = this.state.checklist
      .map(feature => feature.code)
      .join();

    window.history.pushState(null, '', '?checklist=' + checklistCodes);
  }

  updateQuery = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, query: e.currentTarget.value });
  };

  render() {
    const notReady = this.state.data.length === 0;

    return (
      <div className="container">
        {notReady && <Loading />}

        <div className="row">
          <input
            disabled={notReady}
            onInput={this.updateQuery}
            placeholder="Add features"
            title={notReady ? 'Loading data' : ''}
            type="text"
            value={this.state.query}
          />
        </div>

        <Suggestions
          addFeatureToChecklist={this.addFeatureToChecklist}
          data={this.state.data}
          query={this.state.query}
        />

        {this.state.query.length > 0 && <hr />}

        <Checklist
          checklist={this.state.checklist}
          removeFeatureFromChecklist={this.removeFeatureFromChecklist}
        />

        <hr />

        <h2 style={{ textAlign: 'center' }}>Browser Support</h2>

        <BrowserSupport
          browsers={this.state.browsers}
          checklist={this.state.checklist}
        />
      </div>
    );
  }
}

export default App;
