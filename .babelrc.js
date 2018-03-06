/** @format */
const _ = require( 'lodash' );

const calypsoCheck = new RegExp( [ 'webpack', 'bundle.js', 'happypack' ].join( '|' ) ); // heuristics to determine that indicate the babel file is being run in a Calypso environment.  TODO: Should we be explicit instead?
const isCalypso = _.some( process.argv, cmdArg => calypsoCheck.test( cmdArg ) );
const isTest = process.env.NODE_ENV === 'test';
const moduleSystem = isCalypso ? false : 'commonjs';

const config = {
	presets: [
		[
			'@babel/env',
			{
				modules: moduleSystem,
				targets: {
					browsers: [ 'last 2 versions', 'Safari >= 10', 'iOS >= 10', 'not ie <= 10' ],
				},
			},
		],
		'@babel/stage-2',
		'@babel/react',
	],
	plugins: _.compact( [
		! isCalypso && 'add-module-exports',
		'@babel/plugin-proposal-export-default-from',
		'@babel/transform-runtime',
		[
			'transform-imports',
			{
				'state/selectors': {
					transform: 'state/selectors/${member}',
					kebabCase: true,
				},
			},
		],
	] ),
	env: {
		test: {
			plugins: _.compact( [
				isTest && './server/bundler/babel/babel-lodash-es',
				[
					'transform-builtin-extend',
					{
						globals: [ 'Error' ],
					},
				],
			] ),
		},
	},
};
console.error( process.argv, isCalypso, isTest, moduleSystem );
console.error( process.argv, isCalypso, isTest, moduleSystem );
console.error( JSON.stringify( config, '\t', 2 ) );

module.exports = config;
