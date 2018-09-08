/**
 * Actions list having hidden list displayed when user click on list title.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtActions = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings	= cmtjq.extend( {}, cmtjq.fn.cmtFormInfo.defaults, options );
		var actions		= this;

		// Iterate and initialise all the menus
		actions.each( function( index, val ) {

			var list = cmtjq( this );

			init( list, index );
		});

		// return control
		return;

		// == Private Functions == //

		function init( list, index ) {

			var data = list.find( '.actions-list-data' );

			list.attr( 'data-id', index );
			list.find( '.actions-list-title' ).attr( 'data-target', '#actions-list-data-' + index );
			data.attr( 'id', 'actions-list-data-' + index );

			// Detach
			data = data.detach();

			// Append to Body
			data.appendTo( "body" );

			list.find( '.actions-list-title' ).click( function() {

				var offset = list.offset();

				data.css( { top: ( offset.top + list.height() ), left: offset.left } );

				if( data.is( ':hidden' ) ) {

					data.slideDown( 'slow' );
				}
				else {
					
					data.slideUp( 'slow' );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtActions.defaults = {
		position: 'tr'
	};

})( jQuery );
