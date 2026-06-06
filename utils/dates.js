// Helpers de date purs (sans état React), extraits de NotesContext pour être testables.

/** true si `d` est une string non vide représentant une date valide. */
export function isValidDateStr(d) {
  return (
    d != null &&
    typeof d === 'string' &&
    d.length > 0 &&
    !isNaN(new Date(d).getTime())
  );
}

/** Renvoie un objet Date valide ou null. */
export function safeDate(d) {
  if (!isValidDateStr(d)) return null;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/** Date formatée fr-FR en majuscules, ou `fallback` si invalide. */
export function safeDateStr(d, fallback = 'DATE INCONNUE') {
  const parsed = safeDate(d);
  if (!parsed) return fallback;
  try {
    return parsed
      .toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      .toUpperCase();
  } catch (_) {
    return fallback;
  }
}

/** Heure formatée fr-FR (HH:mm), ou `fallback` si invalide. */
export function safeTimeStr(d, fallback = '--:--') {
  const parsed = safeDate(d);
  if (!parsed) return fallback;
  try {
    return parsed.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (_) {
    return fallback;
  }
}

/**
 * Calcule la série (streak) de jours consécutifs d'écriture.
 * Pure : `now` est injectable pour les tests (par défaut la date courante).
 */
export function computeStreak(notes, now = new Date()) {
  try {
    if (!Array.isArray(notes) || notes.length === 0) return 0;

    const validNotes = notes.filter((n) => n && isValidDateStr(n.date));
    if (validNotes.length === 0) return 0;

    const uniqueDays = [...new Set(validNotes.map((n) => n.date.split('T')[0]))]
      .sort()
      .reverse();
    if (uniqueDays.length === 0) return 0;

    const todayStr = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Si on n'a rien écrit aujourd'hui ni hier, la série est brisée.
    if (uniqueDays[0] !== todayStr && uniqueDays[0] !== yesterdayStr) return 0;

    let currentStreak = 0;
    let checkDate = new Date(uniqueDays[0]);

    for (let day of uniqueDays) {
      const d = new Date(day);
      if (isNaN(d.getTime())) continue;
      const diff = Math.floor((checkDate - d) / (1000 * 60 * 60 * 24));

      if (diff === 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return currentStreak;
  } catch (e) {
    return 0;
  }
}

/** Renvoie la liste des notes valides triées de la plus récente à la plus ancienne. */
function sortedValidNotes(notes) {
  if (!Array.isArray(notes)) return [];
  return notes
    .filter((n) => n && isValidDateStr(n.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Date (objet Date) de la note la plus récente, ou null si aucune note valide. */
export function lastNoteDate(notes) {
  const sorted = sortedValidNotes(notes);
  return sorted.length > 0 ? new Date(sorted[0].date) : null;
}

/**
 * Nombre de jours entiers écoulés depuis la dernière note.
 * `now` injectable pour les tests. Renvoie null si aucune note valide.
 */
export function daysSinceLastNote(notes, now = new Date()) {
  const last = lastNoteDate(notes);
  if (!last) return null;
  const diff = now.getTime() - last.getTime();
  if (diff < 0) return 0;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * true si au moins une note valide a été écrite le même jour (UTC) que `now`.
 * Cohérent avec computeStreak (qui raisonne sur les jours ISO/UTC).
 */
export function hasWrittenToday(notes, now = new Date()) {
  if (!Array.isArray(notes)) return false;
  const todayStr = now.toISOString().split('T')[0];
  return notes.some(
    (n) => n && isValidDateStr(n.date) && n.date.split('T')[0] === todayStr,
  );
}

/**
 * Déduit l'heure d'écriture habituelle (0-23) à partir des horodatages des
 * notes : heure locale la plus fréquente. Départage par l'heure la plus basse.
 * Renvoie null si aucune note valide.
 */
export function computeUsualHour(notes) {
  const valid = sortedValidNotes(notes);
  if (valid.length === 0) return null;
  const counts = new Array(24).fill(0);
  for (const n of valid) {
    const h = new Date(n.date).getHours();
    if (h >= 0 && h <= 23) counts[h] += 1;
  }
  let bestHour = 0;
  let bestCount = -1;
  for (let h = 0; h < 24; h++) {
    if (counts[h] > bestCount) {
      bestCount = counts[h];
      bestHour = h;
    }
  }
  return bestCount > 0 ? bestHour : null;
}

/**
 * Renvoie la note réelle la plus proche d'il y a ~1 an (fenêtre ±`windowDays`
 * jours, 14 par défaut), ou null. Cohérent avec la Rétrospective de la Timeline.
 * `now` injectable pour les tests.
 */
export function findOnThisDayNote(notes, now = new Date(), windowDays = 14) {
  if (!Array.isArray(notes)) return null;
  const target = now.getTime() - 365 * 24 * 60 * 60 * 1000;
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const candidates = notes.filter((n) => {
    const d = safeDate(n?.date);
    if (!d) return false;
    return Math.abs(d.getTime() - target) <= windowMs;
  });
  if (candidates.length === 0) return null;
  candidates.sort(
    (a, b) =>
      Math.abs(new Date(a.date).getTime() - target) -
      Math.abs(new Date(b.date).getTime() - target),
  );
  return candidates[0];
}
