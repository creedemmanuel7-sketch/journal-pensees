// Setup global pour Jest.
// Réduit le bruit des console.warn/error volontaires (try/catch) pendant les tests.
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
