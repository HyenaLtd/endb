module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.js"],
  verbose: true,
};
