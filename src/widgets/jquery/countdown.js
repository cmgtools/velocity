/**
 * Countdown Timer plugin can be used to show timer countdown.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtCountdownTimer = function( options ) {

		// == Init == //

		// Configure Modules
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtCountdownTimer.defaults, options );
		var timers		= this;

		// Iterate and initialise all the timers
		timers.each( function() {

			var timer = cmtjq( this );

			init( timer );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Header
		function init( timer ) {

			timeTicker( timer );
		}

		function timeTicker( timer ) {

			var days	= parseInt( timer.find( '.days' ).html() );
			var hours	= parseInt( timer.find( '.hours' ).html() );
			var minutes = parseInt( timer.find( '.minutes' ).html() );
			var seconds = parseInt( timer.find( '.seconds' ).html() );

			if( seconds > 0 ) {

				seconds--;
			}
			else if( seconds === 0 && ( days > 0 || hours > 0 || minutes > 0 ) ) {

				seconds = 59;

				if( minutes > 0 ) {

					minutes--;
				}
				else if( minutes === 0 && ( days > 0 || hours > 0 ) ) {

					minutes = 59;

					if( hours > 0 ) {

						hours--;
					}
					else if( hours === 0 && ( days > 0 ) ) {

						hours = 23;

						if( days > 0 ) {

							days--;
						}
					}
				}
			}

			timer.find( '.days' ).html( days );
			timer.find( '.hours' ).html( hours );
			timer.find( '.minutes' ).html( minutes );
			timer.find( '.seconds' ).html( seconds );

			// Refresh the clock every 1 second
			setTimeout( function() { timeTicker( timer ); }, 1000 );
		}
	};

	// Default Settings
	cmtjq.fn.cmtCountdownTimer.defaults = {

	};

})( jQuery );
