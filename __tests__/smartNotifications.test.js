// Tests des helpers PURS qui alimentent les notifications intelligentes.
// Ils vivent dans utils/dates.js pour rester testables sans modules natifs
// (notifee n'est jamais importé ici).
import {
  lastNoteDate,
  daysSinceLastNote,
  hasWrittenToday,
  computeUsualHour,
  findOnThisDayNote,
} from '../utils/dates';

const NOW = new Date('2026-06-06T12:00:00.000Z');
const note = (iso) => ({ date: iso });

describe('lastNoteDate', () => {
  it('renvoie null sans note valide', () => {
    expect(lastNoteDate([])).toBeNull();
    expect(lastNoteDate(null)).toBeNull();
    expect(lastNoteDate([note('xxx')])).toBeNull();
  });

  it('renvoie la date la plus récente', () => {
    const d = lastNoteDate([
      note('2026-06-01T09:00:00.000Z'),
      note('2026-06-04T09:00:00.000Z'),
      note('2026-06-02T09:00:00.000Z'),
    ]);
    expect(d.toISOString()).toBe('2026-06-04T09:00:00.000Z');
  });
});

describe('daysSinceLastNote', () => {
  it('renvoie null sans note', () => {
    expect(daysSinceLastNote([], NOW)).toBeNull();
  });

  it('renvoie 0 si écrit aujourd’hui', () => {
    expect(daysSinceLastNote([note('2026-06-06T08:00:00.000Z')], NOW)).toBe(0);
  });

  it('compte les jours entiers depuis la dernière note', () => {
    expect(daysSinceLastNote([note('2026-06-03T12:00:00.000Z')], NOW)).toBe(3);
  });

  it('borne à 0 pour une date future', () => {
    expect(daysSinceLastNote([note('2026-06-10T12:00:00.000Z')], NOW)).toBe(0);
  });
});

describe('hasWrittenToday', () => {
  it('true si une note date du même jour (UTC)', () => {
    expect(hasWrittenToday([note('2026-06-06T23:00:00.000Z')], NOW)).toBe(true);
  });

  it('false si rien aujourd’hui', () => {
    expect(hasWrittenToday([note('2026-06-05T23:00:00.000Z')], NOW)).toBe(
      false,
    );
    expect(hasWrittenToday([], NOW)).toBe(false);
  });
});

describe('computeUsualHour', () => {
  it('renvoie null sans note valide', () => {
    expect(computeUsualHour([])).toBeNull();
    expect(computeUsualHour([note('xxx')])).toBeNull();
  });

  it('renvoie l’heure locale la plus fréquente', () => {
    // On construit des dates locales pour éviter les surprises de fuseau.
    const at = (h) => {
      const d = new Date(2026, 5, 1, h, 0, 0, 0);
      return note(d.toISOString());
    };
    const notes = [at(21), at(21), at(8)];
    expect(computeUsualHour(notes)).toBe(21);
  });
});

describe('findOnThisDayNote', () => {
  it('renvoie null si aucune note proche d’il y a un an', () => {
    expect(
      findOnThisDayNote([note('2026-01-01T09:00:00.000Z')], NOW),
    ).toBeNull();
  });

  it('trouve la note la plus proche d’il y a ~1 an (±2 semaines)', () => {
    const notes = [
      note('2025-06-05T09:00:00.000Z'), // ~1 an, très proche de la cible
      note('2025-06-20T09:00:00.000Z'), // ~1 an mais plus loin
      note('2026-06-01T09:00:00.000Z'), // récente
    ];
    const found = findOnThisDayNote(notes, NOW);
    expect(found).not.toBeNull();
    expect(found.date).toBe('2025-06-05T09:00:00.000Z');
  });

  it('exclut les notes hors fenêtre', () => {
    // Il y a ~1 an mais à 1 mois de la cible → hors fenêtre de 14 jours.
    expect(
      findOnThisDayNote([note('2025-07-10T09:00:00.000Z')], NOW),
    ).toBeNull();
  });
});
