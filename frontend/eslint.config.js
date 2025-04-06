import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            globals: globals.browser,
        },
        plugins: {
            js,
            react: pluginReact,
        },
        rules: {
            // 4-space indentation rules
            indent: ['error', 4],
            'react/jsx-indent': ['error', 4],
            'react/jsx-indent-props': ['error', 4],
            // Prettier disables conflicting rules
            ...prettier.rules,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    // TypeScript support
    ...tseslint.configs.recommended,
    // React recommended
    pluginReact.configs.flat.recommended,
]);
