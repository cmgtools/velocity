/**
 * UI utility provides methods to format or manage UI elements.
 */

// == UI Utility ==========================

cmt.utils.ui = {

	/**
	 * Aligns child element content at the center of parent vertically and horizontally. It expect parent to be positioned.
	 */
	alignMiddle: function( parent, child ) {

		var parent	= jQuery( parent );
		var child	= jQuery( child );

		var parentHeight	= parent.height();
		var parentWidth		= parent.width();
		var childHeight		= child.height();
		var childWidth		= child.width();

		if( childHeight <= parentHeight && childWidth <= parentWidth ) {

			var top		= (parentHeight - childHeight) / 2;
			var left	= (parentWidth - childWidth) / 2;

			child.css( { "position": "absolute", "top": top, "left": left } );
		}
	},

	// Initialise Custom Select
	initSelect: function( selector ) {
		
		jQuery( selector ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );
	},

	// Initialise Custom Select
	initSelectElement: function( element ) {
		
		element.cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );
	},
	
	// Initialise Actions
	initActions: function( selector ) {
		
		var actions = jQuery( selector );

		// Actions
		actions.cmtActions();
		actions.find( '.cmt-auto-hide' ).cmtAutoHide();
	},
	
	// Initialise Actions
	initActionsElement: function( element ) {

		// Actions
		element.cmtActions();
		element.find( '.cmt-auto-hide' ).cmtAutoHide();
	}
};
