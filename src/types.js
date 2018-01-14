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

export type { Feature, Requirements };
