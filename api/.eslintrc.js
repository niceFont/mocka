module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		'xo',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	ignorePatterns: ['node_modules', 'dist'],
	plugins: [
		'@typescript-eslint',
	],
	rules: {
	},
};
