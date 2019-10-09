/**
 * The Counter Widget increment or decrement numerical value of a field.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtCounter = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtCounter.defaults, options );
		var counters	= this;

		// Iterate and initialise all the fox sliders
		counters.each( function() {

			var counter = cmtjq( this );

			init( counter );
		});

		// return control
		return;

		// == Private Functions == //

		function init( counter ) {

			var min		= cmt.utils.data.hasAttribute( counter, 'data-min' ) ? counter.attr( 'data-min' ) : settings.min;
			var max		= cmt.utils.data.hasAttribute( counter, 'data-max' ) ? counter.attr( 'data-max' ) : settings.max;
			var val		= cmt.utils.data.hasAttribute( counter, 'data-val' ) ? counter.attr( 'data-val' ) : settings.val;
			var cval	= val;

			var incBtn	= counter.find( '.counter-inc' );
			var decBtn	= counter.find( '.counter-dec' );
			var field	= counter.find( '.counter-val' );

			// Set value
			field.val( cval );

			incBtn.click( function() {

				cval = field.val( cval );

				if( cval < max ) {

					cval++;

					field.val( cval );

					if( cval >= max ) {

						incBtn.addClass( 'disabled' );

					}
					else {

						incBtn.removeClass( 'disabled' );
					}
				}
			});

			decBtn.click( function() {

				cval = field.val( cval );

				if( cval > min ) {

					cval--;

					field.val( cval );

					if( cval <= min ) {

						decBtn.addClass( 'disabled' );

					}
					else {

						decBtn.removeClass( 'disabled' );
					}
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtCounter.defaults = {
		min: 0,
		max: 10,
		val: 0
	};

})( jQuery );
