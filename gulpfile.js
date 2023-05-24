/* eslint-env node */
const { parallel, series, src, dest } = require('gulp');
const rollupTaskFactory = require('@hugsmidjan/gulp-rollup');
const del = require('del');
const { readdirSync, unlinkSync, statSync, readFileSync, writeFileSync } = require('fs');
const writeFile = require('fs').writeFileSync;
const globSync = require('glob').sync;

// ===========================================================================

const srcFolder = 'src/';
const distFolder = 'dist/';
const testingFolder = '__tests/';

const testGlobs = '**/*.tests.{js,ts,tsx}';
const entryGlob = '**/*.{js,ts,tsx}';
const ignoreGlobs = [
	'' + testGlobs,
	'**/*.privates.{js,ts,tsx}', // `*.privates.js` contain private bits that need testing
	'__testing/**/*.{js,ts,tsx}',
	'**/*.WIP.{js,ts,tsx}', // Scripts that should not be bundled/published yet
];

const entryTokens = globSync(entryGlob, {
	cwd: srcFolder,
	ignore: ignoreGlobs,
}).map((file) => file.replace(/\.(?:js|tsx?)$/, ''));

// ===========================================================================

// Returns true for local module ids (treats node_modules/*  as external)
const isNonLocalModule = (id) => !/^(?:\0|\.|\/|tslib)/.test(id);

const baseOpts = {
	src: srcFolder,
	format: 'cjs',
	minify: false,
	sourcemaps: false,
	outputOpts: {
		exports: 'auto',
	},
	inputOpts: {
		external: isNonLocalModule,
	},
};

// ===========================================================================

const [scriptsBundle, scriptsWatch] = rollupTaskFactory({
	...baseOpts,
	name: 'scripts',
	glob: [entryGlob, ...ignoreGlobs.map((glob) => '!' + glob)],
	dist: distFolder,
	typescriptOpts: { declaration: true },
});

const [testsBundle, testsWatch] = rollupTaskFactory({
	...baseOpts,
	name: 'build_tests',
	glob: testGlobs,
	dist: testingFolder,
	// TODO: Create a ospec gulp plugin
	// onWatchEvent: (e) => {
	// 	if (e.code === 'BUNDLE_END') {
	// 		console.info('ospec __tests/' + Object.keys(e.input)[0] + '.js');
	// 		require('child_process').execSync(
	// 			'ospec __tests/' + Object.keys(e.input)[0] + '.js'
	// 		);
	// 	}
	// },
});

// ===========================================================================

const cleanup = () => del([distFolder, testingFolder]);

const addReferenePathsToIndex = (done) => {
	const hasIndexFile = entryTokens.some((token) => token === 'index');

	if (hasIndexFile) {
		const extraEntryPaths = entryTokens
			.filter((token) => token !== 'index')
			.map((token) => `/// <reference path="./${token}.d.ts" />`);
		if (extraEntryPaths.length > 0) {
			const indexDeclFile = `${distFolder}/index.d.ts`;
			writeFileSync(
				indexDeclFile,
				extraEntryPaths.join('\n') + `\n\n` + readFileSync(indexDeclFile)
			);
		}
	}

	done();
};

const makePackageJson = (done) => {
	const pkg = require('./package.json');
	const { dist_package_json } = pkg;
	delete pkg.scripts;
	delete pkg.engines;
	delete pkg.private;
	delete pkg.devDependencies;
	delete pkg.hxmstyle;
	delete pkg.dist_package_json;
	Object.assign(pkg, dist_package_json);
	pkg.exports = Object.fromEntries(
		entryTokens.map((token) => {
			const expToken = `./${token}`.replace(/\/index$/, '');
			return [expToken, `./${token}.js`];
		})
	);
	writeFile(distFolder + 'package.json', JSON.stringify(pkg, null, '\t'));
	done();
};

const copyDocs = () => src(['README.md', 'CHANGELOG.md']).pipe(dest(distFolder));

const removeTypesOnlyModules = (done) => {
	readdirSync(distFolder).forEach((filename) => {
		filename = distFolder + filename;
		if (
			filename.endsWith('.js') &&
			statSync(filename).size < 20 &&
			readFileSync(filename)
				.toString()
				.replace(/^\s*["']use strict["'];?/, '')
				.trim() === ''
		) {
			unlinkSync(filename);
		}
	});
	done();
};

// ===========================================================================

const build = parallel(scriptsBundle, testsBundle);
const watch = parallel(scriptsWatch, testsWatch);
const publishPrep = parallel(
	makePackageJson,
	addReferenePathsToIndex,
	copyDocs,
	removeTypesOnlyModules
);

exports.dev = series(cleanup, build, watch);
exports.build = series(cleanup, build, publishPrep);
exports.default = build;
