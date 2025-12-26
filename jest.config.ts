import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '\\$lib/(.*)\\.js': '<rootDir>/src/lib/$1.ts',
    '(.*)\\.js': '$1',
  },
  transformIgnorePatterns: [],
};

export default config;
