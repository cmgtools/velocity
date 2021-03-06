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

			var popupTop = 0;

			if( cmt.utils.data.hasAttribute( popup, 'data-top' )) {

				popupTop = popup.attr( 'data-top' );
			}

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

				if( parseInt( popupTop ) > 0 ) {

					popupData.css( { 'top': popupTop } );
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

	// Utility method to set value
	cmtjq.fn.cmtPopup.reposition = function( popup ) {

		var screenHeight	= cmtjq( window ).height();
		var screenWidth		= cmtjq( window ).width();

		var popupData		= popup.children( '.popup-data' );
		var popupContent	= popupData.children( '.popup-content-wrap' );
		var contentScroller	= cmt.utils.data.hasAttribute( popup, 'data-csroller' );

		var popupDataHeight	= popupData.outerHeight();
		var popupDataWidth	= popupData.outerWidth();

		var popupTop = 0;

		if( cmt.utils.data.hasAttribute( popup, 'data-top' ) ) {

			popupTop = popup.attr( 'data-top' );
		}

		if( popupDataHeight <= screenHeight ) {

			popupData.css( { 'top': ( screenHeight/2 - popupDataHeight/2 ) + 'px' } );
		}
		else {

			popupData.css( { 'top': 10 + 'px', 'height': ( screenHeight - 20 ) + 'px' } );
		}

		if( popupDataWidth <= screenWidth ) {

			popupData.css( { 'left': ( screenWidth/2 - popupDataWidth/2 ) + 'px' } );
		}
		else {

			popupData.css( { 'left': 10 + 'px', 'width': ( screenWidth - 20 ) + 'px' } );
		}

		if( parseInt( popupTop ) > 0 ) {

			if( popupDataHeight <= ( screenHeight - popupTop ) ) {

				popupData.css( { 'top': popupTop + 'px' } );
			}
			else {

				popupData.css( { 'top': popupTop + 'px', 'height': ( screenHeight - popupTop - 10 ) + 'px' } );
			}
		}

		popupDataHeight	= popupData.outerHeight();

		var popupContentHeight = popupContent.outerHeight();

		if( popupContentHeight > popupDataHeight ) {

			popupContent.css( { 'height': ( popupDataHeight - 20 ) + 'px' } );

			if( contentScroller ) {

				popupContent.addClass( popup.attr( 'data-csroller' ) );
			}
		}
	};

})( jQuery );

// Pre-defined methods to show/hide popups

function showPopup( popupSelector ) {

	var popup = jQuery( popupSelector );

	if( popup.hasClass( 'popup-modal' ) ) {

		//jQuery( 'body' ).css( { 'overflow': 'hidden', 'height': jQuery( window ).height() } );
	}

	popup.fadeIn( 'slow' );

	if( popup.hasClass( 'popup-modal' ) ) {

		jQuery.fn.cmtPopup.reposition( popup );
	}
}

function closePopup( popupSelector ) {

	var popup = jQuery( popupSelector );

	if( popup.hasClass( 'popup-modal' ) ) {

		//jQuery( 'body' ).css( { 'overflow': '', 'height': '', 'margin-right': '' } );
	}

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
