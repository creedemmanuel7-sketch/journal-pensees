import { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  AMBIANCE_RAW_FILES,
  resolveAmbianceFilePath,
  playAmbianceFile,
  stopAmbiancePlayback,
  setAmbianceVolume,
} from '../utils/ambiancePlayer';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const pathCacheRef = useRef({});
  const activeKeyRef = useRef(null);
  const [currentAmbiance, setCurrentAmbiance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const volumeRef = useRef(0.5);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    const preload = async () => {
      for (const key of Object.keys(AMBIANCE_RAW_FILES)) {
        try {
          pathCacheRef.current[key] = await resolveAmbianceFilePath(key);
        } catch (e) {
          console.warn(`[Sound] Préchargement ${key}:`, e);
        }
      }
    };
    preload();
    return () => {
      stopAmbiancePlayback();
      pathCacheRef.current = {};
    };
  }, []);

  const stopSound = async () => {
    activeKeyRef.current = null;
    setIsPlaying(false);
    setCurrentAmbiance('SILENCE');
    await stopAmbiancePlayback();
  };

  const playAmbiance = async (name) => {
    await stopAmbiancePlayback();
    activeKeyRef.current = null;
    setIsPlaying(false);

    if (!name || name === 'SILENCE' || !AMBIANCE_RAW_FILES[name]) {
      setCurrentAmbiance('SILENCE');
      return;
    }

    setCurrentAmbiance(name);

    try {
      let filePath = pathCacheRef.current[name];
      if (!filePath) {
        filePath = await resolveAmbianceFilePath(name);
        pathCacheRef.current[name] = filePath;
      }

      const vol = volumeRef.current;
      await playAmbianceFile(filePath, vol);
      activeKeyRef.current = name;
      setIsPlaying(true);
    } catch (e) {
      console.error(`[Sound] Lecture ${name}:`, e);
      setIsPlaying(false);
      activeKeyRef.current = null;
    }
  };

  const changeVolume = async (newVolume) => {
    setVolume(newVolume);
    volumeRef.current = newVolume;
    if (activeKeyRef.current) {
      await setAmbianceVolume(newVolume);
    }
  };

  return (
    <SoundContext.Provider
      value={{
        currentAmbiance,
        isPlaying,
        volume,
        playAmbiance,
        stopSound,
        changeVolume,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
