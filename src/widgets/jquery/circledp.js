/**
 * Circled plugin can be used to show circular percentage.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtCircledp = function( options ) {

		// == Init == //

		// Configure Modules
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtCircledp.defaults, options );
		var circles		= this;

		// Iterate and initialise all the circles
		circles.each( function() {

			var circle = cmtjq( this );

			init( circle );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Header
		function init( circle ) {

			var value	= cmt.utils.data.hasAttribute( circle, 'data-value' ) ? circle.attr( 'data-value' ) : 0;
			var percent	= circle.find( '.percent' );
			var degree	= ( value / 100 ) * 360;
			var rPie	= circle.find( '.circledp-pie-right' );
			var lPie	= circle.find( '.circledp-pie-left' );

			// Update display value
			percent.html( value );

			// Update Pie
			if( degree <= 180 ) {

				rPie.find( '.circledp-pie-val' ).css( { 'transform': 'translate(0, 100%) rotate(' + degree + 'deg)' } );
			}
			else {

				rPie.find( '.circledp-pie-val' ).css( { 'transform': 'translate(0, 100%) rotate(180deg)' } );
				lPie.find( '.circledp-pie-val' ).css( { 'transform': 'translate(0, 100%) rotate(' + (degree - 180) + 'deg)' } );
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtCircledp.defaults = {

	};

})( jQuery );
