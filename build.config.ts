import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['src/ts/index'],
	externals: ['vite'],
	clean: true,
	declaration: true,
	rollup: {
		emitCJS: true,
		inlineDependencies: true,	
	}
});
