/**
 * @flow
 * @prettier
 */

type Requirements = {
  [string]: {
    [string]: [string],
  },

  // browser: {
  //   version: 'support level code'
  // }
};

type Feature = {
  title: string,
  description: string,
  stats: Requirements,
};

type Support = {
  [string]: {
    full: number | string,
  },
};

export type { Feature, Requirements, Support };
