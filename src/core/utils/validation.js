/**
 * Validators utility provides methods to validate given value.
 */

// == Validators ==========================

cmt.utils.validation = {

	errors: {
		'email' : 'Please provide a valid email address.'
	},

	isEmail: function( email ) {

		var validator = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		return validator.test( email );
	},

	getEmailError: function() {

		return this.errors[ 'email' ];
	}
};
