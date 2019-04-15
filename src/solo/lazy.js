// JavaScript implementation without jQuery
document.addEventListener( "DOMContentLoaded", initLazyImageObserver );

function initLazyImageObserver() {

	var images	= [].slice.call( document.querySelectorAll( 'img.cmt-lazy-img' ) );
	var bkgs	= [].slice.call( document.querySelectorAll( '.cmt-lazy-bkg' ) );

	// Insersection Observer support
	if( "IntersectionObserver" in window ) {

		intersectionObserver = new IntersectionObserver( function( entries, observer ) {

			entries.forEach( function( entry ) {

				if( entry.intersectionRatio > 0 || entry.isIntersecting ) {

					target = entry.target;

					processLazyImage( target );

					observer.unobserve( target );
				}
			});
		});

		images.forEach( function( lazyImage ) {

			intersectionObserver.observe( lazyImage );
		});

		bkgs.forEach( function( bkg ) {

			intersectionObserver.observe( bkg );
		});
	}
	else {

		// Use fallback using scroll listener
		initLazyImageListener( images );
		initLazyImageListener( bkgs );
	}
}

function initLazyImageListener( elements ) {

	// Flag to relax the listener from continuous checking
	var active = false;

	// The actual listener to listen for scroll, resize and change in viewport orientation
	var lazyLoadListener = function() {

		if( active === false ) {

			active = true;

			setTimeout( function() {

				// Iterate over the elements collection for lazy loading
				elements.forEach( function( element ) {

					// Window intersection test
					if( ( element.getBoundingClientRect().top <= window.innerHeight && element.getBoundingClientRect().bottom >= 0 ) && getComputedStyle( element ).display !== "none" ) {

						processLazyImage( element );

						// Remove from collection
						elements = elements.filter( function( target ) {

							return element !== target;
						});

						// Stop lazy loading
						if( elements.length === 0 ) {

							document.removeEventListener( 'scroll', lazyLoadListener );
							window.removeEventListener( 'resize', lazyLoadListener );
							window.removeEventListener( 'orientationchange', lazyLoadListener );
						}
					}
				});

				active = false;
			}, 200 );
		}
	};

	document.addEventListener( 'scroll', lazyLoadListener );
	window.addEventListener( 'resize', lazyLoadListener );
	window.addEventListener( 'orientationchange', lazyLoadListener );
}

function processLazyImage( element ) {

	if( element.classList.contains( 'cmt-lazy-img' ) ) {

		if( typeof element.dataset.src !== 'undefined' ) {

			element.src = element.dataset.src;
		}

		if( typeof element.dataset.srcset !== 'undefined' ) {

			element.srcset = element.dataset.srcset;
		}

		if( typeof element.dataset.sizes !== 'undefined' ) {

			element.sizes = element.dataset.sizes;
		}

		element.classList.remove( '.cmt-lazy-img' );
	}
	else if( element.classList.contains( 'cmt-lazy-bkg' ) ) {

		var width	= window.innerWidth;
		var srcset	= element.dataset.srcset.split( ',' );
		var sizes	= element.dataset.sizes.split( ',' );

		if( typeof sizes[ 0 ] !== 'undefined' && width > parseInt( sizes[ 0 ] ) ) {

			element.style.backgroundImage = "url('" + srcset[ 0 ] + "')"; 
		}
		else if( typeof sizes[ 1 ] !== 'undefined' && width > parseInt( sizes[ 1 ] ) ) {

			element.style.backgroundImage = "url('" + srcset[ 1 ] + "')"; 
		}
		else if( typeof sizes[ 2 ] !== 'undefined' ) {

			element.style.backgroundImage = "url('" + srcset[ 2 ] + "')"; 
		}

		element.classList.remove( '.cmt-lazy-bkg' );
	}
}
