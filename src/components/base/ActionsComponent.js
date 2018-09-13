cmt.components.base.ActionsComponent = function() {

	this.counter = 0;

	this.documentHeight = 0;
	this.screenWidth	= 0;

	this.options = null;
};

cmt.components.base.ActionsComponent.inherits( cmt.components.base.BaseComponent );

cmt.components.base.ActionsComponent.prototype.defaults = {
	listAlignment: 'left' // Can be either left or right
};

// Initialise --------------------

cmt.components.base.ActionsComponent.prototype.init = function( options ) {

	// Configure Object
	this.documentHeight = jQuery( document ).height();
	this.screenWidth	= jQuery( window ).width();

	// Merge Options
	this.options = jQuery.extend( {}, this.defaults, options );
};

cmt.components.base.ActionsComponent.prototype.initElements = function( elements ) {

	var self = this;

	// Iterate and initialise the jQuery elements
	elements.each( function() {

		var element = jQuery( this );

		self.initElement( element );

		self.counter++;
	});
};

cmt.components.base.ActionsComponent.prototype.initElement = function( element ) {

	var self = this;

	var index = self.counter;
	
	var screenWidth = self.screenWidth;

	var data	= element.find( '.actions-list-data' );
	var align	= self.options.listAlignment;

	// Target
	element.find( '.actions-list-title' ).attr( 'data-target', '#actions-list-data-' + index );

	// Identifier
	element.attr( 'data-id', index );
	data.attr( 'data-id', index );

	// Configure Ids
	element.attr( 'id', 'actions-list-' + index );
	data.attr( 'id', 'actions-list-data-' + index );

	// Detach
	data = data.detach();

	// Append to Body
	data.appendTo( 'body' );

	// Alignment
	if( cmt.utils.data.hasAttribute( data, 'data-alignment' ) ) {

		align = data.attr( 'data-alignment' );
	}

	element.find( '.actions-list-title' ).click( function() {

		if( data.is( ':hidden' ) ) {

			var offset	= element.offset();
			var show	= align;

			var dataTop		= offset.top + element.height();
			var dataLeft	= offset.left;
			var dataRight	= screenWidth - offset.left - element.width();

			var dataWidth = data.width();

			// Swap Alignment - Left to Right
			if( align == 'left' && ( offset.left + dataWidth + 5 ) > screenWidth ) {

				show = 'right';
			}
			// Swap Alignment - Right to Left
			else if( align == 'right' && ( offset.left + dataWidth + 5 ) > element.width() ) {

				show = 'left';
			}

			if( show == 'left' ) {

				data.css( { top: dataTop, left: dataLeft } );
			}
			else if( show == 'right' ) {

				data.css( { top: dataTop, right: dataRight } );
			}

			data.slideDown( 'slow' );
		}
		else {

			data.slideUp( 'slow' );
		}
	});
};
