module.exports = {
    "transform": {
      "^.+\\.tsx?$": "ts-jest",
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"],
    "testPathIgnorePatterns": ["dep", "common"],
    "errorOnDeprecated": true,
    "setupTestFrameworkScriptFile": "expect-puppeteer",
    "reporters": [
      "default",
      "./node_modules/jest-html-reporters"
  ]
}