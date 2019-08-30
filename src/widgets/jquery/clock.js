/**
 * Clock plugin can be used to show digital clock.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtClock = function( options ) {

		// == Init == //

		// Configure Modules
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtClock.defaults, options );
		var clocks		= this;

		// Iterate and initialise all the clocks
		clocks.each( function() {

			var clock = cmtjq( this );

			init( clock );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Header
		function init( clock ) {

			clockTicker( clock );
		}

		function clockTicker( clock ) {

			var time = clock.find( '.current-time' ).html();

			var dt	= new Date( time );
			var day	= dt.getDay();
			var hr	= dt.getHours();
			var min	= dt.getMinutes();
			var sec	= dt.getSeconds();

			hr	= hr < 10 ? "0" + hr : hr;
			min = min < 10 ? "0" + min : min;
			sec = sec < 10 ? "0" + sec : sec;

			clock.find( '.day' ).html( cmt.utils.data.weekDays[ day ] );
			clock.find( '.hours' ).html( hr );
			clock.find( '.minutes' ).html( min );
			clock.find( '.seconds' ).html( sec );

			if( hr > 12 ) {

				clock.find( '.period' ).html( 'PM' );
			}
			else {

				clock.find( '.period' ).html( 'AM' );
			}

			dt.setSeconds( dt.getSeconds() + 1 );

			clock.find( '.current-time' ).html( dt.toLocaleString() );

			// TODO: Use requestAnimationFrame instead of setTimeout
			// Refresh the clock every 1 second
			setTimeout( function() { clockTicker( clock ); }, 1000 );
		}
	};

	// Default Settings
	cmtjq.fn.cmtClock.defaults = {
		digital: true
	};

})( jQuery );
