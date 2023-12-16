export default {
	transform: {
		'^.+\\.(j|t)s$': [
			'ts-jest', {
				useESM: true,
				//tsconfig: 'tsconfig.test.json'
			}
		]
	},
	//extensionsToTreatAsEsm: ['.ts'],
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transformIgnorePatterns: [
		"node_modules/(?!(@such-n-such))",
		"packages/core/lib"
	],
}
