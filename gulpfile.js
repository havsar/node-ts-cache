const { parallel, task } = require('gulp');
const del = require('del');
const glob = require('glob');
const childProcess = require('child_process');

task('cleanModules', function() {
	return del(['./ts-cache/node_modules', './storages/*/node_modules']);
});

task('cleanTmp', function() {
	return del(['./ts-cacche/.tmp', './storages/*/.tmp']);
});

task('cleanDist', function() {
	return del(['./ts-cache/dist', './storages/*/dist']);
});

task('updatePackages', function(cb) {
	const check = pkgJsonPath => {
		try {
			return childProcess.execSync(`npx ncu --packageFile ${pkgJsonPath} -u`).toString();
		} catch (error) {
			console.log(`exec error: ${error.message}`);
			process.exit(error.status);
		}
	};
	glob('./**/*/package.json', {}, (er, files) => {
		files.forEach(file => {
			if (file.includes('node_modules')) {
				return;
			}
			// console.log(`command to update: ncu --packageFileDir --packageFile ${file} -u -i`);
			console.log(check(file));
		});
		cb();
	});
});

exports.superclean = parallel('cleanDist', 'cleanTmp', 'cleanModules');

exports.clean = parallel('cleanDist', 'cleanTmp');
