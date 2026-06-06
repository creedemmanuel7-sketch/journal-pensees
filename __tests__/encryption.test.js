import { hashPin, verifyPinHash, isLegacyPin } from '../utils/encryption';

describe('hashPin', () => {
  it('produit deux enveloppes différentes pour le même PIN (sel aléatoire)', () => {
    const a = hashPin('1234');
    const b = hashPin('1234');
    expect(a).not.toEqual(b);

    const pa = JSON.parse(a);
    const pb = JSON.parse(b);
    expect(pa.salt).not.toEqual(pb.salt);
    expect(pa.hash).not.toEqual(pb.hash);
    expect(pa.v).toBe(1);
  });

  it('renvoie une enveloppe JSON commençant par {', () => {
    const env = hashPin('4242');
    expect(env.startsWith('{')).toBe(true);
  });
});

describe('verifyPinHash', () => {
  it('valide le bon PIN contre son propre hash', () => {
    const stored = hashPin('1234');
    expect(verifyPinHash('1234', stored)).toBe(true);
  });

  it('rejette un mauvais PIN', () => {
    const stored = hashPin('1234');
    expect(verifyPinHash('0000', stored)).toBe(false);
  });

  it('gère le format hérité en clair (égalité directe)', () => {
    expect(verifyPinHash('1234', '1234')).toBe(true);
    expect(verifyPinHash('1234', '0000')).toBe(false);
  });

  it('renvoie false pour des entrées invalides', () => {
    expect(verifyPinHash(null, hashPin('1234'))).toBe(false);
    expect(verifyPinHash('1234', null)).toBe(false);
    expect(verifyPinHash('1234', '{invalide')).toBe(false);
  });
});

describe('isLegacyPin', () => {
  it('true pour un PIN en clair', () => {
    expect(isLegacyPin('1234')).toBe(true);
  });

  it('false pour une enveloppe JSON hashPin', () => {
    expect(isLegacyPin(hashPin('1234'))).toBe(false);
  });

  it('false pour null/undefined', () => {
    expect(isLegacyPin(null)).toBe(false);
    expect(isLegacyPin(undefined)).toBe(false);
  });
});
