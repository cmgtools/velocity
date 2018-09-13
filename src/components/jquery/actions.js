/**
 * Actions list having hidden action list displayed when user click on list title.
 */

jQuery.fn.cmtActions = function( options ) {

	var component = null;
	
	// Init Elements
	try {
		
		component = cmt.components.root.getComponent( 'actions' );

		component.initElements( this );
	}
	// Init Component and Elements
	catch( err ) {
		
		component = cmt.components.root.registerComponent( 'actions', 'cmt.components.base.ActionsComponent' );

		component.initElements( this);
	}

	// return control
	return;
};
