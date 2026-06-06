module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  // crypto-js est du JS pur (CommonJS) : pas besoin de le transformer.
  transformIgnorePatterns: [
    'node_modules/(?!(crypto-js)/)',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
    '^react-native-fs$': '<rootDir>/__mocks__/react-native-fs.js',
  },
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
};
