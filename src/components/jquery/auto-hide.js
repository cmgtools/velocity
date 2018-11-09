/**
 * Actions list having hidden list displayed when user click on list title.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtAutoHide = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtFormInfo.defaults, options );
		var triggers	= this;

		// Iterate and initialise all the menus
		triggers.each( function() {

			var trigger = cmtjq( this );

			init( trigger );
		});

		// return control
		return;

		// == Private Functions == //

		function init( trigger ) {

			var hide = jQuery( trigger.attr( 'ldata-target' ) );

			jQuery( window ).click( function( e ) {

				if ( !trigger.is( e.target ) && trigger.has( e.target ).length === 0 ) {

					jQuery( hide ).slideUp();

					trigger.removeClass( 'active' );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtAutoHide.defaults = {
		animation: 'slide'
	};

})( jQuery );
