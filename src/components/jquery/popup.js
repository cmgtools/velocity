/**
 * The Pop-up plugin can be used to show pop-ups. Most common usage is modal dialogs.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtPopup = function( options ) {

		// == Init == //

		// Configure Popups
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtPopup.defaults, options );
		var elements		= this;
		var documentHeight 	= cmtjq( document ).height();
		var screenHeight	= cmtjq( window ).height();
		var screenWidth		= cmtjq( window ).width();

		// Iterate and initialise all the popups
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( popup ) {

			var popupData = popup.children( '.popup-data' );

			// Close Listener
			popupData.children( '.popup-close' ).click( function() {

				closePopup( popup );
			});

			// Modal Window
			if( settings.modal ) {

				// Move modal popups to body element
				popup.appendTo( 'body' );
				
				// Background
				var bkg = popup.find( '.popup-screen' );

				// Filler Layer to listen for close
				var bkgFiller = popup.find( '.popup-screen-listener' );

				if( !popup.hasClass( 'popup-modal' ) ) {

					// Parent to cover document
					popup.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );

					if( bkg.length > 0 ) {

						bkg.css( { 'top': '0px', 'left': '0px', 'height': screenHeight, 'width': screenWidth } );
					}

					if( bkgFiller.length > 0 ) {

						bkgFiller.css( { 'top': '0px', 'left': '0px', 'height': screenHeight, 'width': screenWidth } );
					}
				}

				if( bkgFiller.length > 0 ) {

					bkgFiller.click( function() {

						closePopup( popup );
					});
				}

				// Child at center of parent
				popup.show(); // Need some better solution if it shows flicker effect

				var popupDataHeight	=  popupData.outerHeight();
				var popupDataWidth	=  popupData.outerWidth();

				popup.hide();

				if( popupDataHeight <= screenHeight ) {

					popupData.css( { 'top': ( screenHeight/2 - popupDataHeight/2 ) } );
				}
				else {
					
					popupData.css( { 'top': 10 } );
				}

				if( popupDataWidth <= screenWidth ) {

					popupData.css( { 'left': ( screenWidth/2 - popupDataWidth/2 ) } );
				}
				else {

					popupData.css( { 'left': 10, 'width': screenWidth - 20 } );
				}
			}
		}

		function closePopup( popup ) {

			popup.fadeOut( 'slow' );

			if( settings.modal ) {

				jQuery( 'body' ).css( { 'overflow': '', 'height': '', 'margin-right': '' } );
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtPopup.defaults = {
		modal: true
	};

})( jQuery );

// Pre-defined methods to show/hide popups

function showPopup( popupSelector ) {

	var popup = jQuery( popupSelector );

	if( popup.hasClass( 'popup-modal' ) ) {

		jQuery( 'body' ).css( { 'overflow': 'hidden', 'height': jQuery( window ).height() } );
	}

	popup.fadeIn( 'slow' );
}

function closePopup( popupSelector ) {

	jQuery( popupSelector ).fadeOut( 'fast' );
}

/* Show default error popup */
function showErrorPopup( errors ) {

	jQuery( '#popup-error .popup-content' ).html( errors );

	showPopup( '#popup-error' );
}

function hideErrorPopup() {

	closePopup( '#popup-error' );
}

/* Show default message popup */
function showMessagePopup( message ) {

	jQuery( '#popup-message .popup-content' ).html( message );

	showPopup( '#popup-message' );
}

function hideMessagePopup() {

	closePopup( '#popup-message' );
}
