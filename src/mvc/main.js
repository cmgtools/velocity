/**
 * The base file of Velocity Framework to bootstrap the required namespace and components 
 * specific to communicate with server and process the request and response using MVC patterns.
 */

// == Global Namespace ====================

cmt.api = {};

// TODO: Add Data Binding Support using Model to bind data sent by server to respective ui component
// TODO: Add Data Binding with Pagination for Data Grid
// TODO: Add Page History and Caching Support

// == Applications ========================

cmt.api.Root = function( options ) {

	this.apps		= []; // Alias, Path map

	this.activeApps	= []; // Alias, Application map
}

/**
 * It maps the application to registry by accepting alias and path.
 *
 * @param {string} alias
 * @param {string} path
 */
cmt.api.Root.prototype.mapApplication = function( alias, path ) {

	if( this.apps[ alias ] == undefined ) {

		this.apps[ alias ] = path;
	}
}

/**
 * It returns the application from active applications.
 *
 * @param {string} alias
 * @param {boolean} factory
 * @returns {cmt.api.Application}
 */
cmt.api.Root.prototype.getApplication = function( alias, options ) {

	options = typeof options !== 'undefined' ? options : { };

	if( this.apps[ alias ] == undefined ) {
		
		throw 'Application with alias ' + alias + ' is not registered.';
	}

	// Create singleton instance if not exist
	if( this.activeApps[ alias ] == undefined ) {

		var application = cmt.utils.object.strToObject( this.apps[ alias ] );

		// Initialise Application
		application.init( options );

		// Add singleton to active registry
		this.activeApps[ alias ] = application;
	}

	return this.activeApps[ alias ];
}

/**
 * It set and update the active applications.
 *
 * @param {string} alias
 * @param {cmt.api.Application} application
 */
cmt.api.Root.prototype.setApplication = function( alias, application ) {

	if( this.activeApps[ alias ] == undefined ) {

		this.activeApps[ alias ] = application;
	}
}

/**
 * It maps the application to registry and add it to active applications.
 *
 * @param {string} alias
 * @param {boolean} factory
 * @param {cmt.api.Application} application
 */
cmt.api.Root.prototype.registerApplication = function( alias, path, options ) {
	
	if( this.apps[ alias ] != null ) {
		
		throw 'Application with alias ' + alias + ' is already registered. Cannot register the same alias.';
	}

	this.mapApplication( alias, path );

	return this.getApplication( alias, options );
};

cmt.api.root = new cmt.api.Root();
