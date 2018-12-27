/**
 * The Gallery Plugin shows images as Gallery.
 */

( function( cmtjq ) {

	var component = null;

	var methods = {
		init: function( options ) {

			// Init Elements
			try {

				component.resetOptions( options );

				component.initGalleries( this );
			}
			// Init Component and Elements
			catch( err ) {

				component = cmt.components.root.registerComponent( 'gallery', 'cmt.components.base.GalleryComponent', options );

				component.initGalleries( this );
			}

			if( null != component ) {

				// Window resize
				cmtjq( window ).resize( function() {

					component.normaliseGalleries();
				});
			}
		},
		addItem: function( itemHtml ) {

			var galleryKey = parseInt( jQuery( this[ 0 ] ).attr( 'ldata-id' ) );

			component.addItem( galleryKey, itemHtml );
		},
		removeItem: function( itemKey ) {
			
			var galleryKey = parseInt( jQuery( this[ 0 ] ).attr( 'ldata-id' ) );

			component.removeItem( galleryKey, itemKey );
		}
	};

	cmtjq.fn.cmtGallery = function( param ) {

		// Call exclusive method
        if( methods[ param ] ) {

            return methods[ param ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        }
		// Call init
		else if( typeof param === 'object' || ! param ) {

            return methods.init.apply( this, arguments );
        }
		// Log error
		else {

            cmtjq.error( 'CMT Gallery - method ' +  param + ' does not exist.' );
        }

		// return control
		return;
	};

})( jQuery );
