import { createContext, useContext, useState, useEffect, useRef } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { hashPin, verifyPinHash, isLegacyPin } from '../utils/encryption';

const AuthContext = createContext();
const rnBiometrics = new ReactNativeBiometrics();

const AUTO_LOCK_OPTIONS = [1, 2, 5, 10];

export function AuthProvider({ children }) {
  const [pinConfigured, setPinConfigured] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [decoyConfigured, setDecoyConfigured] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [autoDestructEnabled, setAutoDestructEnabled] = useState(false);
  const [isDecoyMode, setIsDecoyMode] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [intrusionAlert, setIntrusionAlert] = useState(false);
  const [intrusionPhotos, setIntrusionPhotos] = useState([]);
  const [autoLockMinutes, setAutoLockMinutes] = useState(5);
  const [recoveryKeywords, setRecoveryKeywordsState] = useState(null);

  const backgroundTimeRef = useRef(null);

  useEffect(() => {
    loadAuth();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [isAuthenticated, autoLockMinutes, incognitoMode]);

  const handleAppStateChange = (nextState) => {
    if (nextState === 'background' || nextState === 'inactive') {
      backgroundTimeRef.current = Date.now();
      if (incognitoMode) {
        setIsAuthenticated(false);
      }
    } else if (nextState === 'active') {
      if (backgroundTimeRef.current && isAuthenticated) {
        const elapsed = (Date.now() - backgroundTimeRef.current) / 1000 / 60;
        if (elapsed >= autoLockMinutes) {
          setIsAuthenticated(false);
        }
      }
      backgroundTimeRef.current = null;
    }
  };

  const loadAuth = async () => {
    try {
      const savedPin = await AsyncStorage.getItem('user_pin');
      const savedDecoy = await AsyncStorage.getItem('decoy_pin');
      const savedAutoDestruct = await AsyncStorage.getItem('auto_destruct');
      const savedFails = await AsyncStorage.getItem('failed_attempts');
      const savedIncognito = await AsyncStorage.getItem('incognito_mode');
      const savedIntrusion = await AsyncStorage.getItem('intrusion_alert');
      const savedPhotos = await AsyncStorage.getItem('intrusion_photos');
      const savedAutoLock = await AsyncStorage.getItem('auto_lock_minutes');
      const savedRecovery = await AsyncStorage.getItem('recovery_keywords');
      const savedBiometricEnabled =
        await AsyncStorage.getItem('biometric_enabled');

      setPinConfigured(!!savedPin);
      setDecoyConfigured(!!savedDecoy);
      if (savedBiometricEnabled !== null)
        setBiometricEnabled(savedBiometricEnabled === 'true');
      if (savedAutoDestruct)
        setAutoDestructEnabled(savedAutoDestruct === 'true');
      if (savedFails) setFailedAttempts(parseInt(savedFails, 10));
      if (savedIncognito) setIncognitoMode(savedIncognito === 'true');
      if (savedIntrusion) setIntrusionAlert(savedIntrusion === 'true');
      if (savedPhotos) setIntrusionPhotos(JSON.parse(savedPhotos));
      if (savedAutoLock) setAutoLockMinutes(parseInt(savedAutoLock, 10));
      if (savedRecovery) setRecoveryKeywordsState(JSON.parse(savedRecovery));

      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();
      setBiometricAvailable(available && biometryType !== undefined);
    } catch (e) {
      console.error(e);
    } finally {
      setAuthReady(true);
    }
  };

  const authenticateWithBiometric = async () => {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Déverrouiller Mes Pensées',
        cancelButtonText: 'Annuler',
      });
      if (success) {
        setIsAuthenticated(true);
        setFailedAttempts(0);
        await AsyncStorage.setItem('failed_attempts', '0');
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  /** Vérifie un PIN saisi contre le PIN principal stocké (haché). */
  const verifyPin = async (inputPin) => {
    const storedPin = await AsyncStorage.getItem('user_pin');
    return verifyPinHash(inputPin, storedPin);
  };

  const authenticateWithPin = async (inputPin) => {
    const storedPin = await AsyncStorage.getItem('user_pin');
    if (!storedPin) {
      return { success: false, needsSetup: true };
    }
    if (verifyPinHash(inputPin, storedPin)) {
      // Migration silencieuse depuis l'ancien format en clair
      if (isLegacyPin(storedPin)) await savePin(inputPin);
      setIsAuthenticated(true);
      setIsDecoyMode(false);
      setFailedAttempts(0);
      await AsyncStorage.setItem('failed_attempts', '0');
      return { success: true, decoy: false };
    }
    const storedDecoy = await AsyncStorage.getItem('decoy_pin');
    if (storedDecoy && verifyPinHash(inputPin, storedDecoy)) {
      if (isLegacyPin(storedDecoy)) await saveDecoyPin(inputPin);
      setIsAuthenticated(true);
      setIsDecoyMode(true);
      return { success: true, decoy: true };
    }
    const newFails = failedAttempts + 1;
    setFailedAttempts(newFails);
    await AsyncStorage.setItem('failed_attempts', newFails.toString());
    if (autoDestructEnabled && newFails >= 3) {
      return { success: false, autoDestruct: true, attempts: newFails };
    }
    return {
      success: false,
      attempts: newFails,
      intrusionLogged: intrusionAlert,
    };
  };

  const saveIntrusionPhoto = async (photoUri) => {
    await captureIntrusionLog(photoUri);
  };

  const captureIntrusionLog = async (photoUri = null) => {
    try {
      const log = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        note: 'Tentative de déverrouillage échouée',
        photo: photoUri,
      };
      setIntrusionPhotos((prev) => {
        const updated = [log, ...prev].slice(0, 10);
        AsyncStorage.setItem('intrusion_photos', JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const savePin = async (newPin) => {
    await AsyncStorage.setItem('user_pin', hashPin(newPin));
    setPinConfigured(true);
  };

  const saveDecoyPin = async (newDecoyPin) => {
    await AsyncStorage.setItem('decoy_pin', hashPin(newDecoyPin));
    setDecoyConfigured(true);
  };

  const removeDecoyPin = async () => {
    await AsyncStorage.removeItem('decoy_pin');
    setDecoyConfigured(false);
  };

  const toggleBiometric = async (enabled) => {
    setBiometricEnabled(enabled);
    await AsyncStorage.setItem('biometric_enabled', enabled.toString());
  };

  const toggleAutoDestruct = async (enabled) => {
    setAutoDestructEnabled(enabled);
    await AsyncStorage.setItem('auto_destruct', enabled.toString());
  };

  const toggleIncognito = async (enabled) => {
    setIncognitoMode(enabled);
    await AsyncStorage.setItem('incognito_mode', enabled.toString());
  };

  const toggleIntrusionAlert = async (enabled) => {
    setIntrusionAlert(enabled);
    await AsyncStorage.setItem('intrusion_alert', enabled.toString());
  };

  const setAutoLock = async (minutes) => {
    setAutoLockMinutes(minutes);
    await AsyncStorage.setItem('auto_lock_minutes', minutes.toString());
  };

  const lock = () => {
    setIsAuthenticated(false);
    // Conserver isDecoyMode : le mode leurre reste actif après verrouillage
  };

  const setRecoveryKeywords = async (words) => {
    setRecoveryKeywordsState(words);
    await AsyncStorage.setItem('recovery_keywords', JSON.stringify(words));
  };

  const clearIntrusionPhotos = async () => {
    setIntrusionPhotos([]);
    await AsyncStorage.removeItem('intrusion_photos');
  };

  const deleteIntrusionPhoto = async (id) => {
    const updated = intrusionPhotos.filter((p) => p.id !== id);
    setIntrusionPhotos(updated);
    await AsyncStorage.setItem('intrusion_photos', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        pinConfigured,
        authReady,
        decoyConfigured,
        isAuthenticated,
        setIsAuthenticated,
        biometricAvailable,
        biometricEnabled,
        failedAttempts,
        autoDestructEnabled,
        isDecoyMode,
        incognitoMode,
        intrusionAlert,
        intrusionPhotos,
        autoLockMinutes,
        AUTO_LOCK_OPTIONS,
        recoveryKeywords,
        authenticateWithBiometric,
        authenticateWithPin,
        verifyPin,
        savePin,
        saveDecoyPin,
        removeDecoyPin,
        toggleBiometric,
        toggleAutoDestruct,
        toggleIncognito,
        toggleIntrusionAlert,
        setAutoLock,
        lock,
        saveIntrusionPhoto,
        setRecoveryKeywords,
        clearIntrusionPhotos,
        deleteIntrusionPhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
