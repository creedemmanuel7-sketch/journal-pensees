import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const DEFAULT_LOCATION = 'LOMÉ, TG';

async function requestLocationPermission() {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return status === 'granted';
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'MesPensees/1.0' },
    });
    const data = await res.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality;
    const country = data.address?.country_code?.toUpperCase();
    if (city && country) return `${city.toUpperCase()}, ${country}`;
    if (city) return `${city.toUpperCase()}, TG`;
  } catch (e) {
    console.warn('Reverse geocode failed:', e);
  }
  return DEFAULT_LOCATION;
}

export async function resolveNoteLocation(manualLocation) {
  if (manualLocation) return manualLocation;

  const granted = await requestLocationPermission();
  if (!granted) return DEFAULT_LOCATION;

  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const label = await reverseGeocode(latitude, longitude);
        resolve(label);
      },
      () => resolve(DEFAULT_LOCATION),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}
