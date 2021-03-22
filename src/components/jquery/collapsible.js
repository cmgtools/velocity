/**
 * Collapsible plugin can be used to keep the title visible, but show or hide content.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtCollapsible = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings		= cmtjq.extend( {}, cmtjq.fn.cmtCollapsible.defaults, options );
		var collapsibles	= this;

		// Iterate and initialise all the collapsibles
		collapsibles.each( function() {

			var collapsible = cmtjq( this );

			init( collapsible );
		});

		// return control
		return;

		// == Private Functions == //

		function init( collapsible ) {

			var trigger	= collapsible.find( '.cmt-collapsible-trigger' );
			var header	= collapsible.find( '.cmt-collapsible-header' );
			var view	= collapsible.find( '.cmt-collapsible-content' );

			// Hide View
			if( settings.hideView ) {

				view.hide();
			}

			// Listen click
			trigger.click( function() {

				view.slideToggle();
			});

			// Header Trigger
			if( settings.headerTrigger ) {

				header.click( function() {

					view.slideToggle();
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtCollapsible.defaults = {
		hideView: true,
		headerTrigger: true
	};

})( jQuery );
