// == Collage =============================

cmt.components.base.Collage = function() {

	// Max Images
	this.limit = 5;
	
	// Image Counter
	this.counter = 0;

	// Images Arrangement - 1 to 5 images
	this.config = [
		// 1 image - One row having 1 image
		[
			{ cr: { w: "f", h: "xl" } }
		],
		// 2 images - One row having 2 images
		[
			{ cl: { w: "h", h: "l" } },
			{ cb: { w: "0", h: "l" } },
			{ cl: { w: "h", h: "l" } }
		],
		// 3 images - One row having 1 image in first column and 2 images in 2nd column
		[
			{ cl: { w: "h", h: "xl" } },
			{ cb: { w: "0", h: "xl" } },
			{ cle: { w: "h", h: "xl", c: [
				{ cr: { w: "f", h: "m" } },
				{ cr: { w: "f", h: "m" } }
			] } }
		],
		// 4 images - First row having 1 image, Second row having 3 images
		[
			{ cr: { w: "f", h: "xl" } },
			{ cre: { w: "f", h: "l", c: [
				{ cl: { w: "ot", h: "l" } },
				{ cb: { w: "1", h: "l" } },
				{ cl: { w: "ot", h: "l" } },
				{ cb: { w: "1", h: "l" } },
				{ cl: { w: "ot", h: "l" } }
			] } }
		],
		// 5 images - First row having 2 images, Second row having 3 images
		[
			{ cre: { w: "f", h: "xl", c: [
				{ cl: { w: "h", h: "xl" } },
				{ cb: { w: "0", h: "xl" } },
				{ cl: { w: "h", h: "xl" } }
			] } },
			{ cre: { w: "f", h: "l", c: [
				{ cl: { w: "ot", h: "l" } },
				{ cb: { w: "0", h: "l" } },
				{ cl: { w: "ot", h: "l" } },
				{ cb: { w: "0", h: "l" } },
				{ cl: { w: "ot", h: "l" } }
			] } }
		]
	];
};

cmt.components.base.Collage.prototype.generateView = function( element ) {

	var slides	= element.children();
	var config	= this.config[ slides.length ];

	var html = this.generateConfigView( config, slides );

	return html;
};

cmt.components.base.Collage.prototype.generateConfigView = function( config, slides, wrapper ) {

	var html = null != wrapper ? "<div class=\"" + wrapper + "\">" : "<div class=\"crl-wrap\">";

	for( var i = 0; i < config.length; i++ ) {

		var con		= config[ i ];
		var slide	= jQuery( slides[ this.counter ] );

		if( cmt.utils.object.hasProperty( con, "cr" ) ) {
			
			slide.addClass( "cr-wrap" );

			html += "<div class=\"cr cr-w-" + con.cr.w + " cr-h-" + con.cr.h + "\">" + slides[ this.counter ].outerHTML + "</div>";

			this.counter++;
		}
		else if( cmt.utils.object.hasProperty( con, "cl" ) ) {
			
			slide.addClass( "cl-wrap" );

			html += "<div class=\"cl cl-w-" + con.cl.w + " cl-h-" + con.cl.h + "\">" + slides[ this.counter ].outerHTML + "</div>";

			this.counter++;
		}
		else if( cmt.utils.object.hasProperty( con, "cb" ) ) {

			html += "<div class=\"cb cb-w-" + con.cb.w + " cb-h-" + con.cb.h + "\"></div>";
		}
		else if( cmt.utils.object.hasProperty( con, "cle" ) ) {

			html += "<div class=\"cl cl-w-" + con.cle.w + " cl-h-" + con.cle.h + "\">";

			if( cmt.utils.object.hasProperty( con.cle, "c" ) ) {

				html += this.generateConfigView( con.cle.c, slides, "cle-wrap" );
			}

			html += "</div>";
		}
		else if( cmt.utils.object.hasProperty( con, "cre" ) ) {

			html += "<div class=\"cr cr-w-" + con.cre.w + " cr-h-" + con.cre.h + "\">";

			if( cmt.utils.object.hasProperty( con.cre, "c" ) ) {

				html += this.generateConfigView( con.cre.c, slides, "cre-wrap" );
			}

			html += "</div>";
		}
	}

	return html + "</div>";	
};
