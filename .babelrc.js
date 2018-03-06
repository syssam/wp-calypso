/** @format */
const _ = require( 'lodash' );
const path = require( 'path' );

// TODO: remove all these trash heuristics in favor of explicit env setting in package.json
const calypsoCheck = new RegExp( [ 'webpack', 'bundle.js', 'happypack' ].join( '|' ) );
const isCalypso = _.some( process.argv, cmdArg => calypsoCheck.test( cmdArg ) );
const isServer = process.env.IS_SERVER === 'true';
const isTest = process.env.NODE_ENV === 'test';
const moduleSystem = isCalypso && ! isServer ? false : 'commonjs';
const codeSplit =
	! isServer && isCalypso && require( './server/config' ).isEnabled( 'code-splitting' );

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
		isCalypso && [
			path.join(
				__dirname,
				'server',
				'bundler',
				'babel',
				'babel-plugin-transform-wpcalypso-async'
			),
			{ async: ! codeSplit },
		],
		// isCalypso && ! isServer && path.join( __dirname, 'inline-imports.js' ),
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
