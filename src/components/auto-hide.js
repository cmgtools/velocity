// == Auto Hide ===========================

function initAutoHide() {

	hideElement( jQuery( '.auto-hide-trigger' ), jQuery( '.popout' ) );
}

function hideElement( targetElement, hideElement ) {

	jQuery( window ).click( function( e ) {

	    if ( !targetElement.is( e.target ) && targetElement.has( e.target ).length === 0 ) {

			jQuery( hideElement ).slideUp();

	        targetElement.removeClass( 'active' );
	    }
	});
}
