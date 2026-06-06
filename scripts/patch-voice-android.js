/**
 * Copie un build.gradle compatible AGP 9 pour @react-native-voice/voice (jcenter obsolète).
 */
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  '@react-native-voice',
  'voice',
  'android',
  'build.gradle',
);
const source = path.join(__dirname, 'patch-voice-android.gradle');

if (!fs.existsSync(target)) {
  console.warn(
    '[patch-voice-android] @react-native-voice/voice introuvable, ignoré.',
  );
  process.exit(0);
}

fs.copyFileSync(source, target);
console.log('[patch-voice-android] build.gradle mis à jour.');
