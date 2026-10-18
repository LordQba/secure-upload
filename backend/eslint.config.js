import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import security from 'eslint-plugin-security';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'uploads']),
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended, security.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // konwencja w kodzie: nieużywany parametr nazwany z podkreśleniem (np. _next w error handlerze
      // wymaganym przez Expressa w sygnaturze 4-argumentowej) nie jest błędem.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // helpery testowe operują na ścieżkach kontrolowanych lokalnie (foldery uploadu), nie na danych od użytkownika.
    files: ['tests/**/*.ts'],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
]);
