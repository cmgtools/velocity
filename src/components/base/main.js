/**
 * The base file of Velocity Framework to bootstrap the required namespace and components 
 * specific to base of components library.
 */

// == Global Namespace ====================

cmt.components.base = cmt.components.base || {};

// == Components Manager ==================

cmt.components.Root = function( options ) {

	this.components = []; // Alias, Path map

	this.activeComponents = []; // Alias, Component
}

/**
 * It maps the component to registry by accepting alias and path.
 *
 * @param {string} alias
 * @param {string} path
 */
cmt.components.Root.prototype.mapComponent = function( alias, path ) {

	if( this.components[ alias ] == undefined ) {

		this.components[ alias ] = path;
	}
}

/**
 * It returns the component from active components.
 *
 * @param {string} alias
 * @param {object} options
 * @param {boolean} factory
 * @returns {cmt.components.base.BaseComponent}
 */
cmt.components.Root.prototype.getComponent = function( alias, options, factory ) {

	options = typeof options !== 'undefined' ? options : { };

	if( this.components[ alias ] == undefined ) throw 'Component with alias ' + alias + ' is not registered.';

	// Create and return the instance
	if( factory ) {

		var component = cmt.utils.object.strToObject( this.components[ alias ] );

		// Initialise Component
		component.init( options );

		return component;
	}

	// Create singleton instance if not exist
	if( this.activeComponents[ alias ] == undefined ) {

		var component = cmt.utils.object.strToObject( this.components[ alias ] );

		// Initialise Component
		component.init( options );

		// Add singleton to active registry
		this.activeComponents[ alias ] = component;
	}

	return this.activeComponents[ alias ];
}

/**
 * It set and update the active components.
 *
 * @param {string} alias
 * @param {cmt.components.base.BaseComponent} component
 */
cmt.components.Root.prototype.setComponent = function( alias, component ) {

	if( this.activeComponents[ alias ] == undefined ) {

		this.activeComponents[ alias ] = component;
	}
}

/**
 * It maps the component to registry and add it to active components.
 *
 * @param {string} alias
 * @param {string} classpath
 * @param {object} options
 * @returns {cmt.components.base.BaseComponent}
 */
cmt.components.Root.prototype.registerComponent = function( alias, classpath, options ) {

	this.mapComponent( alias, classpath );

	return this.getComponent( alias, options );
};

cmt.components.root = new cmt.components.Root();
