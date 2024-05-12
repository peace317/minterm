import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json"
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "test-file-stub",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "@/(.*)": "<rootDir>/src/$1",
    "@minterm/types": "<rootDir>/src/renderer/types/index.ts",
    "@minterm/services": "<rootDir>/src/services/index.ts"
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/__tests__/mocks/disableCssParsing.js'
  ],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/"
  },
  testPathIgnorePatterns: [
    "mocks",
  ],
  transform: {
    "\\.(ts|tsx|js|jsx)$": "ts-jest"
  }
};

export default config;