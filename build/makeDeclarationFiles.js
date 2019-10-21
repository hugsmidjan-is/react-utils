const { distFolder, srcFolder, scriptGlobs } = require('./helpers');
const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { relative } = require('path');
const glob = require('glob');

const tsExtRe = /\.tsx?$/;

const isIgnoreGlob = (g) => g.charAt(0) === '!';
const isTsFile = (file) => tsExtRe.test(file);

const getTsEntrypoints = () => {
	const include = scriptGlobs.filter((g) => !isIgnoreGlob(g));
	const ignore = scriptGlobs.filter(isIgnoreGlob).map((g) => g.substr(1));
	return include
		.reduce(
			(acc, includeGlob) =>
				acc.concat(glob.sync(includeGlob, { ignore, cwd: srcFolder })),
			[]
		)
		.filter(isTsFile);
};
const stripTsExt = (file) => file.replace(tsExtRe, '');
const getPath = (file) => (/\//.test(file) ? file.replace(/\/[^/]+$/, '') : '');

module.exports = () => {
	const declDir = require('../tsconfig.json').compilerOptions.declarationDir;
	const declDirRelative = './' + relative(distFolder, declDir) + '/';

	let path = '.';
	distFolder
		.replace(/\/$/, '')
		.split('/')
		.forEach((folder) => {
			path += '/' + folder;
			if (!existsSync(path)) {
				mkdirSync(path);
			}
		});

	getTsEntrypoints().forEach((file) => {
		const outFile = distFolder + stripTsExt(file) + '.d.ts';

		const tscDeclFile = relative(getPath(file), declDirRelative + outFile);

		writeFileSync(
			outFile,
			[
				'export * from "' + tscDeclFile + '";',
				'import x from "' + tscDeclFile + '";',
				'export default x;',
				'',
			].join('\n')
		);
	});
	console.info('Created local declaration files for TypeScripted entrypoints.');
};
