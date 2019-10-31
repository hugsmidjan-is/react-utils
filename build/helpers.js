const srcFolder = 'src/';

const scriptsGlobs = '**/*.{js,ts,tsx}';
const globs = {
	tests: '**/*.tests.{js,ts,tsx}',
	privates: '**/*.privates.{js,ts,tsx}', // `*.privates.js` contain private bits that need testing
	testHelpers: '__testing/**/*.{js,ts,tsx}',
	wip: '**/*.WIP.{js,ts,tsx}', // Scripts that should not be bundled/published yet
};

exports.srcFolder = srcFolder;
exports.scriptGlobs = [scriptsGlobs].concat(
	Object.values(globs).map((glob) => '!' + glob)
);
exports.testGlobs = [globs.tests];
exports.distFolder = 'dist/';
exports.testingFolder = '__tests/';
