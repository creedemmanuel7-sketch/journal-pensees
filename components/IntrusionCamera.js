import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { persistIntrusionPhoto } from '../utils/intrusionPhoto';

/**
 * Photo discrete apres echec PIN (alerte intrusion).
 */
export default function IntrusionCamera({
  intrusionAlert,
  failedAttempts,
  onPhotoCaptured,
}) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const frontDevice = useCameraDevice('front');
  const backDevice = useCameraDevice('back');
  const device = frontDevice || backDevice;
  const cameraRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const lastAttemptRef = useRef(0);

  useEffect(() => {
    if (intrusionAlert) requestPermission();
  }, [intrusionAlert]);

  useEffect(() => {
    if (
      !intrusionAlert ||
      failedAttempts <= 0 ||
      failedAttempts === lastAttemptRef.current
    )
      return;
    lastAttemptRef.current = failedAttempts;

    const takePhoto = async () => {
      if (!hasPermission) {
        await requestPermission();
      }
      if (cameraRef.current && cameraReady && device) {
        try {
          const photo = await cameraRef.current.takePhoto({
            flash: 'off',
            enableShutterSound: false,
          });
          const raw = photo.path.startsWith('file://')
            ? photo.path
            : `file://${photo.path}`;
          const saved = await persistIntrusionPhoto(raw);
          await onPhotoCaptured(saved);
          return;
        } catch (e) {
          console.warn('IntrusionCamera takePhoto:', e);
        }
      }
      await onPhotoCaptured(null);
    };

    const timer = setTimeout(takePhoto, 1200);
    return () => clearTimeout(timer);
  }, [failedAttempts, intrusionAlert, cameraReady, device, hasPermission]);

  if (!intrusionAlert || !device) return null;

  return (
    <Camera
      ref={cameraRef}
      style={{
        width: 1,
        height: 1,
        opacity: 0,
        position: 'absolute',
        left: -1000,
      }}
      device={device}
      isActive={intrusionAlert && hasPermission}
      photo
      onInitialized={() => setCameraReady(true)}
    />
  );
}
