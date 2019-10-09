/**
 * A simple slider(simplified version of FoxSlider arranged in filmstrip fashion) to slide
 * UI elements in circular fashion. We can use FoxSlider for more complex scenarios.
 */

( function( cmtjq ) {

	var component = null;

	var methods = {
		init: function( options ) {

			// Init Elements
			try {

				component.resetOptions( options );

				component.initSliders( this );
			}
			// Init Component and Elements
			catch( err ) {

				component = cmt.components.root.registerComponent( 'slider', 'cmt.components.base.SliderComponent', options );

				component.initSliders( this );
			}

			if( null != component ) {

				// Window resize
				cmtjq( window ).resize( function() {

					component.normaliseSliders();
				});
			}
		},
		// Adds a new slide using the given HTML and re-arrange the slides
		addSlide: function( slideHtml ) {

			var sliderKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.addSlide( sliderKey, slideHtml );
		},
		// Removes slide using the given key and re-arrange the slides
		removeSlide: function( slideKey ) {

			var sliderKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.removeSlide( sliderKey, slideKey );
		},
		// Scroll slider to the given position in %
		scrollToPosition: function( position, animate ) {

			var sliderKey = parseInt( jQuery( this[ 0 ] ).attr( 'data-idx' ) );

			component.scrollToPosition( sliderKey, position, animate );
		}
	};

	cmtjq.fn.cmtSlider = function( param ) {

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

            cmtjq.error( 'CMT Slider - method ' +  param + ' does not exist.' );
        }

		// return control
		return;
	};

})( jQuery );
