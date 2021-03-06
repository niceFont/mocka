module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'plugin:react/recommended',
		'xo',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: [
		'react',
		'@typescript-eslint',
	],
	settings: {
		react: {
			version: 'detect',
		},
	},
	ignorePatterns: ['postgres-data', 'build', 'public', 'node_modules'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		camelcase: 'off',
	},
};
