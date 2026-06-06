import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { wipeAllData } from '../utils/wipe';

const DIRS = ['mespensees-media', 'intrusion', 'ambiances'];

describe('wipeAllData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    RNFS.exists.mockResolvedValue(false);
    RNFS.unlink.mockResolvedValue();
  });

  it('appelle AsyncStorage.clear une seule fois', async () => {
    await wipeAllData();
    expect(AsyncStorage.clear).toHaveBeenCalledTimes(1);
  });

  it('supprime chaque dossier existant via RNFS.unlink', async () => {
    RNFS.exists.mockResolvedValue(true);
    await wipeAllData();

    expect(RNFS.unlink).toHaveBeenCalledTimes(DIRS.length);
    for (const dir of DIRS) {
      expect(RNFS.unlink).toHaveBeenCalledWith(
        `${RNFS.DocumentDirectoryPath}/${dir}`,
      );
    }
  });

  it("n'appelle pas unlink pour un dossier absent", async () => {
    // Ordre des dossiers : mespensees-media (présent), intrusion (absent), ambiances (présent)
    RNFS.exists
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    await wipeAllData();

    expect(RNFS.unlink).toHaveBeenCalledTimes(2);
    expect(RNFS.unlink).toHaveBeenCalledWith(
      `${RNFS.DocumentDirectoryPath}/mespensees-media`,
    );
    expect(RNFS.unlink).toHaveBeenCalledWith(
      `${RNFS.DocumentDirectoryPath}/ambiances`,
    );
    expect(RNFS.unlink).not.toHaveBeenCalledWith(
      `${RNFS.DocumentDirectoryPath}/intrusion`,
    );
  });

  it('renvoie true même si AsyncStorage.clear échoue', async () => {
    AsyncStorage.clear.mockRejectedValueOnce(new Error('boom'));
    await expect(wipeAllData()).resolves.toBe(true);
  });
});
