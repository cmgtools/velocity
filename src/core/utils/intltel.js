/**
 * IntlTel utility provides methods to format the mobile and phone numbers.
 */

// == Intl Tel Utility ====================

cmt.utils.intltel = {

	initIntlTelInput: function( ccode ) {

		var cc = null != ccode ? ccode : 'us';

		if( !jQuery().intlTelInput ) {

			return;
		}

		jQuery( '.intl-tel-field-mb' ).intlTelInput({
			formatOnDisplay: false,
			separateDialCode: true,
			initialCountry: cc,
			numberType: "MOBILE",
			preventInvalidNumbers: true
		});

		jQuery( '.intl-tel-field-ph' ).intlTelInput({
			formatOnDisplay: false,
			separateDialCode: true,
			initialCountry: cc,
			numberType: "FIXED_LINE",
			preventInvalidNumbers: true
		});

		jQuery( '.intl-tel-field' ).each( function() {

			cmt.utils.intltel.populateIntlField( jQuery( this ) );
		});

		jQuery( '.intl-tel-field' ).on( 'blur', function() {

			cmt.utils.intltel.validateIntlField( jQuery( this ) );
		});

		jQuery( '.intl-tel-input' ).closest( '.form' ).on( 'submit', function() {

			var result = true;

			jQuery( this ).find( '.intl-tel-field' ).each( function() {

				var field = jQuery( this );

				if( !cmt.utils.intltel.validateIntlField( field ) ) {

					result = false;
				}
			});

			return result;
		});
	},

	initIntlTelField: function( field ) {

		if( !jQuery().intlTelInput ) {

			return;
		}

		if( null == field || field.length == 0 ) {

			return;
		}

		var type = cmt.utils.data.hasAttribute( field, 'data-intl-type' ) ? field.attr( 'data-intl-type' ) : 'mobile'; // mobile or phone

		switch( type ) {

			case 'mobile': {

				cmt.utils.intltel.initMobileField( field );

				break;
			}
			case 'phone': {

				cmt.utils.intltel.initPhoneField( field );

				break;
			}
		}
	},

	initMobileField: function( field ) {

		var cc		= cmt.utils.data.hasAttribute( field, 'data-ccode' ) ? field.attr( 'data-ccode' ) : 'us';
		var ccOnly	= cmt.utils.data.hasAttribute( field, 'data-ccode-only' ) ? field.attr( 'data-ccode-only' ) : null;

		if( null != ccOnly ) {

			field.intlTelInput({
				formatOnDisplay: false,
				separateDialCode: true,
				initialCountry: cc,
				numberType: "MOBILE",
				preventInvalidNumbers: true,
				onlyCountries: [ ccOnly ]
			});
		}
		else {

			field.intlTelInput({
				formatOnDisplay: false,
				separateDialCode: true,
				initialCountry: cc,
				numberType: "MOBILE",
				preventInvalidNumbers: true
			});
		}
		cmt.utils.intltel.populateIntlField( field );

		field.on( 'blur', function() {

			cmt.utils.intltel.validateIntlField( field );
		});

		field.closest( '.form' ).on( 'submit', function() {

			var result = true;

			if( !cmt.utils.intltel.validateIntlField( field ) ) {

				result = false;
			}

			return result;
		});
	},

	initPhoneField: function( field ) {

		var cc = cmt.utils.data.hasAttribute( field, 'data-ccode' ) ? field.attr( 'data-ccode' ) : 'us';

		jQuery( '.intl-tel-field-ph' ).intlTelInput({
			formatOnDisplay: false,
			separateDialCode: true,
			initialCountry: cc,
			numberType: "FIXED_LINE",
			preventInvalidNumbers: true
		});

		cmt.utils.intltel.populateIntlField( field );

		field.on( 'blur', function() {

			cmt.utils.intltel.validateIntlField( field );
		});

		field.closest( '.form' ).on( 'submit', function() {

			var result = true;

			if( !cmt.utils.intltel.validateIntlField( field ) ) {

				result = false;
			}

			return result;
		});
	},

	validateIntlField: function( field ) {

		var parent	= field.closest( '.form-group' );
		var val		= field.val();
		var ccode	= "+" + field.intlTelInput( 'getSelectedCountryData' ).dialCode;

		if( val == '' && field.hasClass( 'intl-tel-required' ) ) {

			parent.find( '.help-block' ).html( 'Mobile cannot be blank.' );

			return false;
		}
		else if( val.length > 0 && !field.intlTelInput( 'isValidNumber' ) ) {

			parent.find( '.help-block' ).html( 'Mobile number format is wrong.' );

			return false;
		}
		else {

			parent.find( '.help-block' ).html( '' );
		}

		// Format Standard - ITU-T E.164
		// field.intlTelInput( 'getNumber', intlTelInputUtils.numberFormat.E164 )

		var number = field.intlTelInput( 'getNumber' );

		if( number !== ccode ) {

			parent.find( '.intl-tel-number' ).val( field.intlTelInput( 'getNumber' ) );
		}
		else {

			parent.find( '.intl-tel-number' ).val( '' );
		}

		return true;
	},

	populateIntlField: function( field ) {

		var parent	= field.closest( '.form-group' );
		var val		= parent.find( '.intl-tel-number' );

		if( val.length > 0 ) {

			field.intlTelInput( 'setNumber', val.val() );
		}
	}
};
