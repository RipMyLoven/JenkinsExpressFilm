const { hello } = require('./app.js');

test('hello function should return Hello World!', () => {
expect(hello("Alien")).toBe('My favorite film is Alien!');
});
