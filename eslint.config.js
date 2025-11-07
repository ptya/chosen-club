import js from '@eslint/js';

import drizzle from 'eslint-plugin-drizzle';

import prettierRecommended from 'eslint-plugin-prettier/recommended';

import simpleImportSort from 'eslint-plugin-simple-import-sort';

import svelte from 'eslint-plugin-svelte';

import globals from 'globals';

import ts from 'typescript-eslint';

import svelteConfig from './svelte.config.js';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	{
		plugins: {
			drizzle: drizzle,
		},
		rules: {
			'drizzle/enforce-delete-with-where': 'error',
			'drizzle/enforce-update-with-where': 'error',
		},
	},
	...svelte.configs['flat/recommended'],
	prettierRecommended,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		// See more details at: https://typescript-eslint.io/packages/parser/
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'], // Add support for additional file extensions, such as .svelte
				parser: ts.parser,
				// We recommend importing and specifying svelte.config.js.
				// By doing so, some rules in eslint-plugin-svelte will automatically read the configuration and adjust their behavior accordingly.
				// While certain Svelte settings may be statically loaded from svelte.config.js even if you don't specify it,
				// explicitly specifying it ensures better compatibility and functionality.
				svelteConfig,
			},
		},
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/'],
	},
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
);
