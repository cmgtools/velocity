/**
 * Smooth Scroll plugin can be used to listen for hash tags to scroll smoothly to pre-defined page sections.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtSmoothScroll = function( options ) {

		// == Init == //

		// Configure Modules
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtSmoothScroll.defaults, options );
		var elements	= this;

		// Iterate and initialise all the page modules
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( element ) {

			element.on( 'click', function ( e ) {

				var targetId = this.hash;

				// Process only if hash is set
				if ( null != targetId && targetId.length > 0 ) {

					// Prevent default anchor behavior
			    	e.preventDefault();

					var target		= jQuery( targetId );
					var topOffset	= 0;

					if( cmt.utils.data.hasAttribute( target, 'data-height-target' ) ) {
						
						topOffset = jQuery( target.attr( 'data-height-target' ) ).height();
					}
					else if( null != settings.heightElement ) {

						topOffset = settings.heightElement.height();
					}

					// Find target element
			    	var target = cmtjq( targetId );

			    	cmtjq( 'html, body' ).stop().animate(
			    		{ 'scrollTop': ( target.offset().top - topOffset ) },
			    		900,
			    		'swing',
			    		function () {

							// Add hash to url - It will ignore the topOffset and sets top position to 0
							if( settings.changeHash ) {

								window.location.hash = targetId;
							}
			    		}
			    	);
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtSmoothScroll.defaults = {
		changeHash: false,
		heightElement: null
	};

})( jQuery );
