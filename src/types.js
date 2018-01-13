type Requirements = {
  [string]: {
    [string]: [string],
  },
};

type Feature = {
  title: string,
  description: string,
  stats: Requirements,
};

export type { Feature, Requirements };
