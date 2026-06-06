import {
  isValidDateStr,
  safeDate,
  safeDateStr,
  safeTimeStr,
  computeStreak,
} from '../utils/dates';

describe('isValidDateStr', () => {
  it('true pour une date ISO valide', () => {
    expect(isValidDateStr('2026-06-06T10:00:00.000Z')).toBe(true);
  });
  it('false pour null, vide ou invalide', () => {
    expect(isValidDateStr(null)).toBe(false);
    expect(isValidDateStr('')).toBe(false);
    expect(isValidDateStr('pas une date')).toBe(false);
    expect(isValidDateStr(123)).toBe(false);
  });
});

describe('safeDate', () => {
  it('renvoie un objet Date pour une string valide', () => {
    expect(safeDate('2026-06-06T10:00:00.000Z')).toBeInstanceOf(Date);
  });
  it('renvoie null pour une string invalide', () => {
    expect(safeDate('xxx')).toBeNull();
    expect(safeDate(null)).toBeNull();
  });
});

describe('safeDateStr / safeTimeStr', () => {
  it('renvoie le fallback pour une date invalide', () => {
    expect(safeDateStr('xxx')).toBe('DATE INCONNUE');
    expect(safeDateStr('xxx', 'N/A')).toBe('N/A');
    expect(safeTimeStr('xxx')).toBe('--:--');
  });
  it('renvoie une string non vide pour une date valide', () => {
    expect(typeof safeDateStr('2026-06-06T10:00:00.000Z')).toBe('string');
    expect(safeDateStr('2026-06-06T10:00:00.000Z')).not.toBe('DATE INCONNUE');
  });
});

describe('computeStreak', () => {
  const NOW = new Date('2026-06-06T12:00:00.000Z');
  const note = (iso) => ({ date: iso });

  it('renvoie 0 sans note', () => {
    expect(computeStreak([], NOW)).toBe(0);
    expect(computeStreak(null, NOW)).toBe(0);
  });

  it("renvoie 0 si rien écrit aujourd'hui ni hier", () => {
    expect(computeStreak([note('2026-06-01T08:00:00.000Z')], NOW)).toBe(0);
  });

  it("compte une série de jours consécutifs incluant aujourd'hui", () => {
    const notes = [
      note('2026-06-06T09:00:00.000Z'),
      note('2026-06-05T09:00:00.000Z'),
      note('2026-06-04T09:00:00.000Z'),
    ];
    expect(computeStreak(notes, NOW)).toBe(3);
  });

  it("démarre la série depuis hier si rien aujourd'hui", () => {
    const notes = [
      note('2026-06-05T09:00:00.000Z'),
      note('2026-06-04T09:00:00.000Z'),
    ];
    expect(computeStreak(notes, NOW)).toBe(2);
  });

  it('dédoublonne plusieurs notes le même jour', () => {
    const notes = [
      note('2026-06-06T09:00:00.000Z'),
      note('2026-06-06T20:00:00.000Z'),
      note('2026-06-05T09:00:00.000Z'),
    ];
    expect(computeStreak(notes, NOW)).toBe(2);
  });

  it("s'arrête au premier trou dans la série", () => {
    const notes = [
      note('2026-06-06T09:00:00.000Z'),
      note('2026-06-04T09:00:00.000Z'),
    ];
    expect(computeStreak(notes, NOW)).toBe(1);
  });

  it('ignore les notes avec dates invalides', () => {
    const notes = [
      note('2026-06-06T09:00:00.000Z'),
      note('pas une date'),
      note(null),
    ];
    expect(computeStreak(notes, NOW)).toBe(1);
  });
});
