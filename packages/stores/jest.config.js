export default {
	transform: {
		'^.+\\.[jt]s$': [
			'ts-jest', {
				useESM: true,
				///tsconfig: 'tests/tsconfig.json'
			}
		]
	},
	extensionsToTreatAsEsm: ['.ts'],
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transformIgnorePatterns: [
		"node_modules/(?!(@such-n-such|fast-equals))",
		"packages/core/lib"
	],
}
