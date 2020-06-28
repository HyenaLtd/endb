module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['dist', 'node_modules', '__tests__'],
  roots: ['<rootDir>/packages'],
  verbose: true,
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
};
