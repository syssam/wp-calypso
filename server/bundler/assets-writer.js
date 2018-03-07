/** @format */
/**
 * External Dependencies
 */
const fs = require( 'fs' ); // eslint-disable-line  import/no-nodejs-modules
const path = require( 'path' );

function AssetsWriter( options ) {
	this.options = Object.assign(
		{
			path: './build',
			filename: 'assets.json',
		},
		options
	);
	this.createOutputStream();
}

Object.assign( AssetsWriter.prototype, {
	createOutputStream: function() {
		this.outputPath = path.join( this.options.path, this.options.filename );
		this.outputStream = fs.createWriteStream( this.outputPath );
	},
	apply: function( compiler ) {
		const self = this;
		compiler.plugin( 'after-emit', function( compilation, callback ) {
			const stats = compilation.getStats().toJson( {
				hash: true,
				publicPath: true,
				assets: true,
				children: false,
				chunks: true,
				chunkModules: false,
				chunkOrigins: false,
				entrypoints: true,
				modules: false,
				source: false,
				errorDetails: true,
				timings: false,
				reasons: false,
			} );

			const statsToOutput = {};
			statsToOutput.publicPath = stats.publicPath;
			statsToOutput.manifests = {};

			for ( const name in stats.assetsByChunkName ) {
				// make the manifest inlineable
				if ( String( name ).startsWith( 'manifest' ) ) {
					statsToOutput.manifests[ name ] = compilation.assets[
						stats.assetsByChunkName[ name ]
					].source();
				}
			}

			statsToOutput.entrypoints = stats.entrypoints;

			for ( const entrypoint in statsToOutput.entrypoints ) {
				// remove the manifest
				statsToOutput.entrypoints[ entrypoint ].chunks = statsToOutput.entrypoints[
					entrypoint
				].chunks.filter( function( p ) {
					return ! String( p ).startsWith( 'manifest' );
				} );
				statsToOutput.entrypoints[ entrypoint ].assets = statsToOutput.entrypoints[
					entrypoint
				].assets
					.filter( function( p ) {
						return ! p.startsWith( 'manifest' );
					} )
					.map( function( p ) {
						return path.join( stats.publicPath, p );
					} );
			}
			statsToOutput.assetsByChunkName = stats.assetsByChunkName;

			for ( const chunkname in statsToOutput.assetsByChunkName ) {
				statsToOutput.assetsByChunkName[ chunkname ] = path.join(
					statsToOutput.publicPath,
					statsToOutput.assetsByChunkName[ chunkname ]
				);
			}
			statsToOutput.chunks = stats.chunks.map( function( chunk ) {
				return Object.assign( {}, chunk, {
					files: chunk.files.map( function( file ) {
						return path.join( stats.publicPath, file );
					} ),
				} );
			} );

			self.outputStream.write( JSON.stringify( statsToOutput, null, 2 ) );
			callback();
		} );
	},
} );

module.exports = AssetsWriter;
