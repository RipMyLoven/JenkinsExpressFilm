const { hello } = require('./app.js');

test('Film function should return My favorite film is Alien!', () => {
expect(hello("Alien")).toBe('My favorite film is Alien!');
});
