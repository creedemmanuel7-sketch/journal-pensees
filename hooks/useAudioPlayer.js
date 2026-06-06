import { useState, useRef, useEffect } from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// Format secondes -> mm:ss (00:00 si invalide)
export const formatPlaybackTime = (sec) => {
  if (isNaN(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * Encapsule la logique de lecture audio (AudioRecorderPlayer) :
 * play/pause, suivi de la position/durée et nettoyage.
 * `playerRef` est exposé pour les usages partagés (enregistrement, stop manuel).
 */
export function useAudioPlayer() {
  // Singleton fourni par react-native-audio-recorder-player (ne pas instancier avec new)
  const playerRef = useRef(AudioRecorderPlayer);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState('00:00');
  const [playbackDuration, setPlaybackDuration] = useState('00:00');

  useEffect(() => {
    return () => {
      playerRef.current.stopPlayer().catch(() => {});
      playerRef.current.removePlayBackListener();
    };
  }, []);

  // Play/Pause local voice notes with detailed elapsed time progress
  const handlePlayAudio = async (audioItem) => {
    if (playingAudioId === audioItem.id) {
      await playerRef.current.stopPlayer();
      playerRef.current.removePlayBackListener();
      setPlayingAudioId(null);
    } else {
      try {
        if (playingAudioId) {
          await playerRef.current.stopPlayer().catch(() => {});
          playerRef.current.removePlayBackListener();
        }
        setPlayingAudioId(audioItem.id);
        setPlaybackPosition('00:00');
        setPlaybackDuration('00:00');

        await playerRef.current.startPlayer(audioItem.uri);
        playerRef.current.addPlayBackListener((e) => {
          const curSec = Math.floor(e.currentPosition / 1000);
          const durSec = Math.floor(e.duration / 1000);
          setPlaybackPosition(formatPlaybackTime(curSec));
          setPlaybackDuration(formatPlaybackTime(durSec));
          if (e.currentPosition >= e.duration - 100) {
            playerRef.current.stopPlayer().catch(() => {});
            setPlayingAudioId(null);
          }
        });
      } catch (err) {
        console.error('Failed to play audio', err);
        setPlayingAudioId(null);
      }
    }
  };

  return {
    playerRef,
    playingAudioId,
    setPlayingAudioId,
    playbackPosition,
    playbackDuration,
    handlePlayAudio,
  };
}
