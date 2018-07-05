import {uglify} from 'rollup-plugin-uglify';
import buble from 'rollup-plugin-buble';
import path from 'path';
import resolve from 'resolve';

import {main} from './package.json';

export default {
	input: 'src/index.js',
	output: {
		file: main,
		format: 'umd',
		name: path.basename(main, path.extname(main)),
	},
	plugins: [
		(function() {
			let entry;
			return {
				name: 'resolve',

				options(options) {
					({entry} = options);
				},

				resolveId(importee, importer) {
					if (importer) {
						let basedir = path.dirname(importer);
						if (importee.startsWith('/')) {
							console.log(importee);
							importee = path.relative(basedir, path.resolve(entry, '..' + importee));
							if (!importee.startsWith('.')) {
								importee = './' + importee;
							}
						}
						console.log(basedir, importee);
						return resolve.sync(importee, {basedir});
					}
				},
			};
		})(),
		buble({objectAssign: 'Object.assign'}),
		uglify(),
	],
};
