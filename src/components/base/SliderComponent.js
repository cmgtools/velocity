cmt.components.base.SliderComponent = function() {

	// Id Tracker
	this.counter = 1;

	// Id & Index Prefix
	this.idKey		= 'cmt-slider-';
	this.indexKey	= 'sl-';

	// All Sliders
	this.sliders = {};

	// Component Options
	this.options = null;
};

cmt.components.base.SliderComponent.inherits( cmt.components.base.BaseComponent );

cmt.components.base.SliderComponent.prototype.defaults = {
	// Controls
	lControlContent: null,
	rControlContent: null,
	// Callback - Content is less than slider
	smallerContent: null,
	// Listener Callback for slide click
	onSlideClick: null,
	// Listener Callback for pre processing
	preSlideChange: null,
	// Listener Callback for post processing
	postSlideChange: null,
	circular: true,
	// Collage
	collage: false,
	collageLimit: 5,
	collageConfig: null,
	// Lightbox
	lightbox: false,
	lightboxBkg: true, // Image as Background or Wrap the Image
	lightboxId: 'lightbox-slider'
};

// == Slider Component ====================

cmt.components.base.SliderComponent.prototype.init = function( options ) {

	// Merge Options
	this.options = jQuery.extend( {}, this.defaults, options );
};

cmt.components.base.SliderComponent.prototype.resetOptions = function( options ) {

	// Merge Options
	this.options = jQuery.extend( {}, this.defaults, options );
};

cmt.components.base.SliderComponent.prototype.initSliders = function( elements ) {

	var self = this;

	// Iterate and initialise the jQuery elements
	elements.each( function() {

		var element = jQuery( this );

		var slider = new cmt.components.base.Slider( self, element );

		slider.init();

		element.attr( 'id', self.idKey + self.counter );
		element.attr( 'ldata-id', self.counter );

		self.sliders[ self.indexKey + self.counter ] = slider;

		self.counter++;
	});
};

cmt.components.base.SliderComponent.prototype.normaliseSliders = function() {

	var sliders = this.sliders;

	// Iterate and normalise all the sliders
    for( var key in sliders ) {

		sliders[ key ].normalise();
    }
};

cmt.components.base.SliderComponent.prototype.addSlide = function( sliderKey, slideHtml ) {

	this.sliders[ this.indexKey + sliderKey ].addSlide( slideHtml );
};

cmt.components.base.SliderComponent.prototype.removeSlide = function( sliderKey, slideKey ) {

	this.sliders[ this.indexKey + sliderKey ].removeSlide( slideKey );
};

// == Slider ==============================

cmt.components.base.Slider = function( component, element ) {

	// Component & Options
	this.component	= component;
	this.options	= component.options;

	// The Element
	this.element = element;

	// Controls
	this.leftControl	= null;
	this.rightControl	= null;

	// Dimensions
	this.width	= 0;
	this.height	= 0;
	this.slideWidth	= 0;
	this.slidesCount = 0;

	// Slides
	this.filmstrip = null;

	this.slides = null;
};

cmt.components.base.Slider.prototype.init = function() {

	// Slider View
	this.initView();

	// Init Slides based on configuration params
	this.normalise();

	// Indexify the Slides
	this.indexSlides();
};

// Update View
cmt.components.base.Slider.prototype.initView = function() {
	
	var self = this;

	var options = this.options;
	var slides	= this.element.children();

	// Generate Collage
	if( options.collage && slides.length > 0 && slides.length <= options.collageLimit ) {

		this.element.css( 'height', 'auto' );

		var collage = new cmt.components.base.Collage();

		collage.limit	= options.collageLimit;
		collage.config	= null != options.collageConfig ? options.collageConfig : collage.config;

		var html = collage.generateView( this.element );

		this.element.html( html );

		this.slides = this.element.find( '.cl-wrap, .cr-wrap' );

		// Set slides position on filmstrip
		this.slides.each( function() {

			var currentSlide = jQuery( this );

			self.resetSlide( currentSlide );
		});
		
		// Index
		this.indexSlides();

		return;
	}

	// Add slide class to all the slides
	slides.each( function() {

		var slide = jQuery( this );

		slide.addClass( 'slider-slide' );
	});

	slides = this.element.find( '.slider-slide' ).detach();

	// Slides
	var view = '<div class="slider-slides-wrap"><div class="slider-slides"></div></div>';

	// Controls
	view += '<div class="slider-control slider-control-left"></div><div class="slider-control slider-control-right"></div>';

	this.element.html( view );

	this.element.find( '.slider-slides' ).append( slides );
};

// Make filmstrip of all slides
cmt.components.base.Slider.prototype.normalise = function() {

	var self	= this;
	var options = this.options;
	var element	= this.element;

	// Controls
	this.leftControl	= element.find( '.slider-control-left' );
	this.rightControl	= element.find( '.slider-control-right' );

	// Dimensions
	this.width	= element.width();
	this.height	= element.height();

	// Slides
	this.filmstrip = element.find( '.slider-slides' );

	this.slides = element.find( '.slider-slide' );

	this.slideWidth		= this.slides.outerWidth();
	this.slidesCount	= this.slides.length;

	// Filmstrip Width
	this.filmstrip.width( this.slideWidth * this.slidesCount );

	// Initialise Slide position
	var currentPosition	= 0;

	// Set slides position on filmstrip
	this.slides.each( function() {

		var currentSlide = jQuery( this );

		currentSlide.css( { 'width': self.slideWidth, 'left': currentPosition } );

		currentPosition += self.slideWidth;

		self.resetSlide( currentSlide );
	});

	if( this.filmstrip.width() < element.width() ) {

		// Notify the Callback for lower width
		if( null !== options.smallerContent ) {

			options.smallerContent( element, this.filmstrip );
		}
	}
	
	// Initialise controls
	this.initControls();
};

// Index the slides
cmt.components.base.Slider.prototype.indexSlides = function() {

	// Set slides position on filmstrip
	this.slides.each( function( index ) {

		var currentSlide = jQuery( this );

		currentSlide.attr( 'ldata-id', index );
	});
}

// Initialise the Slider controls
cmt.components.base.Slider.prototype.initControls = function() {
	
	var self	= this;
	var options = this.options;
	var element	= this.element;

	if( this.filmstrip.width() < element.width() ) {

		this.leftControl.hide();
		this.rightControl.hide();

		return;
	}
	else {

		this.leftControl.show();
		this.rightControl.show();
	}

	// Show Controls
	var lControlContent	= options.lControlContent;
	var rControlContent	= options.rControlContent;

	// Init Listeners
	this.leftControl.html( lControlContent );
	this.rightControl.html( rControlContent );

	if( !options.circular ) {

		this.leftControl.hide();
		this.rightControl.show();
	}
	
	this.leftControl.unbind( 'click' );

	this.leftControl.click( function() {

		if( options.circular ) {

			self.showPrevSlide();
		}
		else {

			self.moveToRight();
		}
	});
	
	this.rightControl.unbind( 'click' );

	this.rightControl.click( function() {

		if( options.circular ) {

			self.showNextSlide();
		}
		else {

			self.moveToLeft();
		}
	});
};

// Add Slide
cmt.components.base.Slider.prototype.addSlide = function( slideHtml ) {

	// Set slides position on filmstrip
	this.slides.each( function() {

		var currentSlide = jQuery( this );

		var newIndex = parseInt( currentSlide.attr( 'ldata-id' ) ) + 1;

		currentSlide.attr( 'ldata-id', newIndex );
	});

	var slide = this.filmstrip.find( '.slider-slide[ldata-id=1]' );

	if( slide.length == 0 ) {

		this.filmstrip.append( slideHtml );

		slide = this.filmstrip.find( ':first-child' )[ 0 ];
		slide = jQuery( slide );
	}
	else {

		this.filmstrip.find( '.slider-slide[ldata-id=1]' ).before( slideHtml );

		slide = slide.prev();
	}

	slide.attr( 'ldata-id', 0 );
	slide.addClass( 'slider-slide' );

	// Normalise slides
	this.normalise();
};

// Remove Slide
cmt.components.base.Slider.prototype.removeSlide = function( slideKey ) {

	// Remove
	this.filmstrip.find( '.slider-slide[ldata-id=' + slideKey + ']' ).remove();

	// Set slides position on filmstrip
	this.slides.each( function() {

		var currentSlide = jQuery( this );

		var index = parseInt( currentSlide.attr( 'ldata-id' ) );

		if( index > slideKey ) {

			currentSlide.attr( 'ldata-id', ( index - 1 ) );
		}
	});

	// Normalise slides
	this.normalise();
};

cmt.components.base.Slider.prototype.resetSlide = function( slide ) {

	var self = this;

	var options = this.options;
	var element	= this.element;

	if( null !== options.onSlideClick ) {

		// remove existing click event
		slide.unbind( 'click' );

		// reset click event
		slide.click( function() {

			options.onSlideClick( element, slide, slide.attr( 'ldata-id' ) );
		});
	}

	if( options.lightbox ) {

		slide.click( function() {

			self.showLightbox( slide, slide.attr( 'ldata-id' ) );
		});
	}
};

// == Slides Movement ==

// Calculate and re-position slides to form filmstrip
cmt.components.base.Slider.prototype.resetSlides = function() {

	var self = this;

	var currentPosition	= 0;

	this.slides = this.filmstrip.find( '.slider-slide' );

	// reset filmstrip
	this.filmstrip.css( { left: 0 + 'px', 'right' : '' } );

	this.slides.each( function() {

		jQuery( this ).css( { 'left': currentPosition + 'px', 'right' : '' } );

		currentPosition += self.slideWidth;
	});
};

// Show Previous Slide on clicking next button
cmt.components.base.Slider.prototype.showNextSlide = function() {

	var self	= this;
	var options = this.options;
	var element	= this.element;

	var firstSlide = this.slides.first();

	// do pre processing
	if( null !== options.preSlideChange ) {

		options.preSlideChange( element, firstSlide, firstSlide.attr( 'ldata-id' ) );
	}

	// do animation - animate slider
	this.filmstrip.animate(
		{ left: -this.slideWidth },
		{
			duration: 500,
			complete: function() {

				// Remove first and append to last
				var firstSlide = self.slides.first();

				firstSlide.insertAfter( self.slides.eq( self.slides.length - 1 ) );
				firstSlide.css( 'right', -self.slideWidth );

				self.resetSlides();
			}
		}
	);

	firstSlide = this.slides.first();

	// do post processing
	if( null !== options.postSlideChange ) {

		options.postSlideChange( element, firstSlide, firstSlide.attr( 'ldata-id' ) );
	}
}

// Show Next Slide on clicking previous button
cmt.components.base.Slider.prototype.showPrevSlide = function() {

	var self	= this;
	var options = this.options;
	var element	= this.element;

	var firstSlide = this.slides.first();

	// do pre processing
	if( null !== options.preSlideChange ) {

		options.preSlideChange( element, firstSlide, firstSlide.attr( 'ldata-id' ) );
	}

	// Remove last and append to first
	var lastSlide = this.slides.last();

	lastSlide.insertBefore( this.slides.eq( 0 ) );
	lastSlide.css( 'left', -this.slideWidth );

	// do animation - animate slider
	this.filmstrip.animate(
		{ left: this.slideWidth },
		{
			duration: 500,
			complete: function() {

				var slider = jQuery( this ).parent();

				self.resetSlides( slider );
			}
		}
	);

	firstSlide = this.slides.first();

	// do post processing
	if( null !== options.postSlideChange ) {

		options.postSlideChange( element, firstSlide, firstSlide.attr( 'ldata-id' ) );
	}
}

// Move to left on clicking next button
cmt.components.base.Slider.prototype.moveToLeft = function() {
	
	var self	= this;
	var element = this.element;

	var firstSlide		= this.slides.first();
	var slideWidth		= firstSlide.outerWidth();

	var sliderWidth		= element.outerWidth();
	var filmWidth		= this.filmstrip.outerWidth();
	var filmLeft		= this.filmstrip.position().left;

	var moveBy			= slideWidth;
	var leftPosition	= filmLeft - moveBy;
	var remaining		= filmWidth + leftPosition;

	if( remaining > ( sliderWidth - moveBy ) ) {

		// do animation - animate slider
		this.filmstrip.animate(
			{ left: leftPosition },
			{
				duration: 500,
				complete: function() {

					var filmWidth	= self.filmstrip.outerWidth();
					var filmLeft	= self.filmstrip.position().left;

					var leftPosition	= filmLeft - moveBy;
					var remaining		= filmWidth + leftPosition;

					if( remaining < ( sliderWidth - moveBy ) ) {

						self.rightControl.hide();
					}

					if( self.leftControl.is( ':hidden' ) ) {

						self.leftControl.fadeIn( 'fast' );
					}
				}
			}
		);
	}
}

// Move to right on clicking prev button
cmt.components.base.Slider.prototype.moveToRight = function() {
	
	var self = this;

	var filmLeft = this.filmstrip.position().left;

	var moveBy			= this.slideWidth;
	var leftPosition	= filmLeft;

	if( leftPosition < -( this.slideWidth/2 ) ) {

		leftPosition = filmLeft + moveBy;

		// do animation - animate slider
		this.filmstrip.animate(
			{ left: leftPosition },
			{
				duration: 500,
				complete: function() {

					var filmLeft = self.filmstrip.position().left;

					if( filmLeft > -( self.slideWidth/2 ) ) {

						self.leftControl.hide();
						self.filmstrip.position( { at: "left top" } );
					}

					if( self.rightControl.is( ':hidden' ) ) {

						self.rightControl.fadeIn( 'fast' );
					}
				}
			}
		);
	}
	else {

		this.leftControl.hide();
		this.filmstrip.position( { at: "left top" } );
	}
};

// Move to left on clicking next button
cmt.components.base.Slider.prototype.showLightbox = function( slide, slideId ) {

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

	// Prepare Gallery
	element.find( '.slider-slide, .slide, .cl-wrap, .cr-wrap' ).each( function() {

		var slide	= jQuery( this );
		var slId	= slide.attr( 'ldata-id' );

		var thumbUrl = slide.attr( 'thumb-url' );
		var imageUrl = slide.attr( 'image-url' );

		if( slideId == slId ) {

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

	// Sliders
	lightboxData.find( '.slider-lightbox' ).cmtSlider({
		lControlContent: '<i class="fa fa-2x fa-angle-left valign-center"></i>',
		rControlContent: '<i class="fa fa-2x fa-angle-right valign-center"></i>',
		circular: false,
		onSlideClick: self.setLightboxBkg
	});
}

cmt.components.base.Slider.prototype.setLightboxBkg = function( slider, slide, slideId ) {

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
