/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': [
      '@swc/jest',
      { jsc: { parser: { syntax: 'typescript' }, target: 'es2022' }, module: { type: 'commonjs' } },
    ],
  },
  // Kod ma importy z rozszerzeniem .js (wymóg ESM/nodenext), ale pliki źródłowe to .ts — zdejmujemy .js, żeby Jest znalazł właściwy plik.
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
};
