cmt.components.base.GalleryComponent = function() {

	// Id Tracker
	this.counter = 1;

	// Id & Index Prefix
	this.idKey		= 'cmt-gallery-';
	this.indexKey	= 'gl-';

	// All Galleries
	this.galleries = {};

	// Component Options
	this.options = null;
};

cmt.components.base.GalleryComponent.inherits( cmt.components.base.BaseComponent );

cmt.components.base.GalleryComponent.prototype.defaults = {
	// Listener Callback for item click
	onItemClick: null,
	// Collage
	collage: false,
	collageLimit: 5,
	collageConfig: null,
	// Lightbox
	lightbox: false,
	lightboxBkg: true, // Image as Background or Wrap the Image
	lightboxId: 'lightbox-slider'
};

// == Gallery Component ====================

cmt.components.base.GalleryComponent.prototype.init = function( options ) {

	// Merge Options
	this.options = jQuery.extend( {}, this.defaults, options );
};

cmt.components.base.GalleryComponent.prototype.resetOptions = function( options ) {

	// Merge Options
	this.options = jQuery.extend( {}, this.defaults, options );
};

cmt.components.base.GalleryComponent.prototype.initGalleries = function( elements ) {

	var self = this;

	// Iterate and initialise the jQuery elements
	elements.each( function() {

		var element = jQuery( this );

		var gallery = new cmt.components.base.Gallery( self, element );

		gallery.init();

		element.attr( 'id', self.idKey + self.counter );
		element.attr( 'data-idx', self.counter );

		self.galleries[ self.indexKey + self.counter ] = gallery;

		self.counter++;
	});
};

cmt.components.base.GalleryComponent.prototype.normaliseGalleries = function() {

	var galleries = this.galleries;

	// Iterate and normalise all the galleries
    for( var key in galleries ) {

		galleries[ key ].normalise();
    }
};

cmt.components.base.GalleryComponent.prototype.addItem = function( galleryKey, itemHtml ) {

	this.galleries[ this.indexKey + galleryKey ].addItem( itemHtml );
};

cmt.components.base.GalleryComponent.prototype.removeItem = function( galleryKey, itemKey ) {

	this.galleries[ this.indexKey + galleryKey ].removeItem( itemKey );
};

// == Gallery ==============================

cmt.components.base.Gallery = function( component, element ) {

	// Component & Options
	this.component	= component;
	this.options	= component.options;

	// The Element
	this.element = element;

	// Dimensions
	this.width	= 0;
	this.height	= 0;
	this.itemWidth	= 0;
	this.itemsCount = 0;

	// Items
	this.itemsWrapper = null;

	this.items = null;
};

cmt.components.base.Gallery.prototype.init = function() {

	// Gallery View
	this.initView();

	// Init Items based on configuration params
	this.normalise();

	// Indexify the Items
	this.indexItems();
};

// Update View
cmt.components.base.Gallery.prototype.initView = function() {

	var self = this;

	var options = this.options;
	var items	= this.element.children();

	// Generate Collage
	if( options.collage && items.length > 0 && items.length <= options.collageLimit ) {

		this.element.css( 'height', 'auto' );

		var collage = new cmt.components.base.Collage();

		collage.limit	= options.collageLimit;
		collage.config	= null != options.collageConfig ? options.collageConfig : collage.config;

		var html = collage.generateView( this.element );

		this.element.html( html );

		this.items = this.element.find( '.cl-wrap, .cr-wrap' );

		// Set items position
		this.items.each( function() {

			var currentItem = jQuery( this );

			self.resetItem( currentItem );
		});
	
		// Index
		this.indexItems();

		return;
	}

	// Add item class to all the items
	items.each( function() {

		var item = jQuery( this );

		item.addClass( 'gallery-item' );
	});

	items = this.element.find( '.gallery-item' ).detach();

	// Items
	var view = '<div class="gallery-items-wrap"><div class="gallery-items"></div></div>';

	this.element.html( view );

	this.itemsWrapper = this.element.find( '.gallery-items' );

	this.element.find( '.gallery-items' ).append( items );
};

// Normalise the items
cmt.components.base.Gallery.prototype.normalise = function() {

	var self	= this;
	var element	= this.element;

	// Dimensions
	this.width	= element.width();
	this.height	= element.height();

	// Items
	this.items = element.find( '.gallery-item' );

	this.itemWidth	= this.items.outerWidth();
	this.itemsCount	= this.items.length;

	// Set items position
	this.items.each( function() {

		var currentItem = jQuery( this );

		currentItem.css( { 'width': self.itemWidth } );

		self.resetItem( currentItem );
	});
};

// Index the items
cmt.components.base.Gallery.prototype.indexItems = function() {

	// Set items position
	this.items.each( function( index ) {

		var currentItem = jQuery( this );

		currentItem.attr( 'data-idx', index );
	});
}

// Add Item
cmt.components.base.Gallery.prototype.addItem = function( itemHtml ) {

	// Set items position
	this.items.each( function() {

		var currentItem = jQuery( this );

		var newIndex = parseInt( currentItem.attr( 'data-idx' ) ) + 1;

		currentItem.attr( 'data-idx', newIndex );
	});

	var item = this.itemsWrapper.find( '.gallery-item[data-idx=1]' );

	if( item.length == 0 ) {

		this.itemsWrapper.append( itemHtml );

		item = this.itemsWrapper.find( ':first-child' )[ 0 ];
		item = jQuery( item );
	}
	else {

		this.itemsWrapper.find( '.gallery-item[data-idx=1]' ).before( itemHtml );

		item = item.prev();
	}

	item.attr( 'data-idx', 0 );
	item.addClass( 'gallery-item' );

	// Normalise items
	this.normalise();
};

// Remove Item
cmt.components.base.Gallery.prototype.removeItem = function( itemKey ) {

	// Remove
	this.itemsWrapper.find( '.gallery-item[data-idx=' + itemKey + ']' ).remove();

	// Set items position
	this.items.each( function() {

		var currentItem = jQuery( this );

		var index = parseInt( currentItem.attr( 'data-idx' ) );

		if( index > itemKey ) {

			currentItem.attr( 'data-idx', ( index - 1 ) );
		}
	});

	// Normalise items
	this.normalise();
};

cmt.components.base.Gallery.prototype.resetItem = function( item ) {

	var self = this;

	var options = this.options;
	var element	= this.element;

	if( null !== options.onItemClick ) {

		// remove existing click event
		item.unbind( 'click' );

		// reset click event
		item.click( function() {

			options.onItemClick( element, item, item.attr( 'data-idx' ) );
		});
	}

	if( options.lightbox ) {

		item.click( function() {

			self.showLightbox( item, item.attr( 'data-idx' ) );
		});
	}
};

// Move to left on clicking next button
cmt.components.base.Gallery.prototype.showLightbox = function( item, itemId ) {

	var self		= this;
	var element		= this.element;
	var lightboxId	= this.options.lightboxId;
	var lightbox	= jQuery( '#' + lightboxId );

	// Configure
	var screenWidth		= jQuery( window ).width();
	var screenHeight	= jQuery( window ).height();

	var lightboxData = lightbox.find( '.lightbox-data' );

	var widthRatio	= screenWidth/12;
	var heightRatio	= screenHeight/12;

	lightboxData.css( { top: heightRatio/2, left: widthRatio/2, width: ( widthRatio * 11 ), height: ( heightRatio * 11 ) } );

	if( self.options.lightboxBkg ) {
		
		lightbox.find( '.lightbox-data-bkg' ).addClass( 'lightbox-bkg-wrap' );
	}

	var sliderHtml = '<div class="slider slider-basic slider-lightbox">';

	// Prepare Slider
	element.find( '.gallery-item, .item, .cl-wrap, .cr-wrap' ).each( function() {

		var item	= jQuery( this );
		var slId	= item.attr( 'data-idx' );

		var thumbUrl = item.attr( 'thumb-url' );
		var imageUrl = item.attr( 'image-url' );

		if( itemId == slId ) {

			sliderHtml += '<div class="active"><div class="bkg-image" style="background-image: url(' + thumbUrl + ');" image-url="' + imageUrl + '"></div></div>';

			if( self.options.lightboxBkg ) {

				lightbox.find( '.lightbox-data-bkg' ).css( 'background-image', 'url(' + imageUrl + ')' );
			}
			else {
				
				lightbox.find( '.lightbox-data-bkg' ).html( '<img src="' + imageUrl + '"/>' );
			}
		}
		else {

			sliderHtml += '<div><div class="bkg-image" style="background-image: url(' + thumbUrl + ');" image-url="' + imageUrl + '"></div></div>';
		}
	});

	sliderHtml += '</div>';

	lightboxData.find( '.wrap-gallery' ).html( sliderHtml );

	if( lightbox.hasClass( 'popup-modal' ) ) {

		jQuery( 'body' ).css( { 'overflow': 'hidden', 'height': jQuery( window ).height() } );
	}

	lightbox.fadeIn( 'slow' );

	lightboxData.find( '.slider-lightbox' ).cmtSlider({
		lControlContent: '<i class="fa fa-2x fa-angle-left valign-center"></i>',
		rControlContent: '<i class="fa fa-2x fa-angle-right valign-center"></i>',
		circular: false,
		onSlideClick: self.setLightboxBkg
	});
}

cmt.components.base.Gallery.prototype.setLightboxBkg = function( slider, slide, slideId ) {

	var imageUrl = slide.find( '.bkg-image' ).attr( 'image-url' );

	var bkg = slider.closest( '.lightbox-slider-wrap' ).find( '.lightbox-data-bkg' );

	slider.find( '.slide' ).removeClass( 'active' );
	slide.addClass( 'active' );

	bkg.hide();

	if( bkg.hasClass( 'lightbox-bkg-wrap' ) ) {

		bkg.css( 'background-image', 'url(' + imageUrl + ')');
	}
	else {
		
		bkg.html( '<img src="' + imageUrl + '"/>' );
	}

	bkg.fadeIn( 'slow' );
}
