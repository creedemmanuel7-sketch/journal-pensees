// Mock manuel de react-native-fs pour les tests Jest.
module.exports = {
  DocumentDirectoryPath: '/mock/Documents',
  CachesDirectoryPath: '/mock/Caches',
  TemporaryDirectoryPath: '/mock/tmp',
  exists: jest.fn(() => Promise.resolve(false)),
  unlink: jest.fn(() => Promise.resolve()),
  mkdir: jest.fn(() => Promise.resolve()),
  copyFile: jest.fn(() => Promise.resolve()),
  writeFile: jest.fn(() => Promise.resolve()),
  readFile: jest.fn(() => Promise.resolve('')),
  readDir: jest.fn(() => Promise.resolve([])),
  moveFile: jest.fn(() => Promise.resolve()),
};
