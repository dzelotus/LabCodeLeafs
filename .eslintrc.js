module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: ['plugin:react/recommended', 'airbnb'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
	rules: {
		indent: ['error', 4, { SwitchCase: 1 }],
		quotes: ['error', 'single', { avoidEscape: true }],

		'no-empty-function': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'react/display-name': 'off',
		'react/prop-types': 'off',
		'prettier/prettier': 'error',
	},
};
