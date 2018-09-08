/**
 * CmtFieldGroup plugin allows to show/hide group of fields using checkbox within the element.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtFieldGroup = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFieldGroup.defaults, options );
		var fieldGroups		= this;

		// Iterate and initialise all the fox sliders
		fieldGroups.each( function() {

			var fieldGroup = cmtjq( this );

			init( fieldGroup );
		});

		// return control
		return;

		// == Private Functions == //

		function init( fieldGroup ) {

			var checkbox	= fieldGroup.find( "input[type='checkbox']" );
			var radio		= fieldGroup.find( "input[type='radio']" );
			var reverse		= cmt.utils.data.hasAttribute( fieldGroup, 'data-reverse' );

			if( checkbox.length > 0 ) {

				if( checkbox.prop( 'checked' ) ) {

					checkPositive( fieldGroup, reverse );
				}
				else {

					checkNegative( fieldGroup, reverse );
				}

				fieldGroup.click( function() {

					if( checkbox.prop( 'checked' ) ) {

						checkPositive( fieldGroup, reverse );
					}
					else {

						checkNegative( fieldGroup, reverse );
					}
				});
			}
			else if( radio.length > 0 ) {

				var status = parseInt( fieldGroup.find( "input[type='radio']:checked" ).val() );
			
				if( status == 1 ) {

					checkPositive( fieldGroup, reverse );
				}
				else if( status == 0 ) {

					checkNegative( fieldGroup, reverse );
				}

				fieldGroup.find( "input[type='radio']" ).change( function() {

					status = parseInt( fieldGroup.find( "input[type='radio']:checked" ).val() );

					if( status == 1 ) {

						checkPositive( fieldGroup, reverse );
					}
					else if( status == 0 ) {

						checkNegative( fieldGroup, reverse );
					}
				});
			}
		}
		
		function checkPositive( fieldGroup, reverse ) {

			var target	= fieldGroup.attr( 'group-target' );
			var alt		= fieldGroup.attr( 'group-alt' );

			if( reverse ) {

				jQuery( '.' + target ).hide();
				jQuery( '.' + alt ).show();
			}
			else {

				jQuery( '.' + target ).show();
				jQuery( '.' + alt ).hide();
			}
		}
		
		function checkNegative( fieldGroup, reverse ) {

			var target	= fieldGroup.attr( 'group-target' );
			var alt		= fieldGroup.attr( 'group-alt' );

			if( reverse ) {

				jQuery( '.' + target ).show();
				jQuery( '.' + alt ).hide();
			}
			else {

				jQuery( '.' + target ).hide();
				jQuery( '.' + alt ).show();
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtFieldGroup.defaults = {
		// options
	};

})( jQuery );
