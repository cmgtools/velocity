/**
 * Actions list having hidden action list displayed when user click on list title.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtActions = function( options ) {

		var component = null;

		// Init Elements
		try {

			component = cmt.components.root.getComponent( 'actions' );

			component.initElements( this );
		}
		// Init Component and Elements
		catch( err ) {

			component = cmt.components.root.registerComponent( 'actions', 'cmt.components.base.ActionsComponent', options );

			component.initElements( this );
		}

		// return control
		return;
	};

})( jQuery );
