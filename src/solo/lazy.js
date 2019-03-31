// JavaScript implementation without jQuery
document.addEventListener( "DOMContentLoaded", initLazyObserver );

function initLazyObserver() {

	var images	= [].slice.call( document.querySelectorAll( 'img.cmt-lazy-img' ) );
	var bkgs	= [].slice.call( document.querySelectorAll( '.cmt-lazy-bkg' ) );

	// Insersection Observer support
	if( "IntersectionObserver" in window ) {

		intersectionObserver = new IntersectionObserver( function( entries, observer ) {

			entries.forEach( function( entry ) {

				if( entry.intersectionRatio > 0 || entry.isIntersecting ) {

					target = entry.target;
					
					if( target.classList.contains( 'cmt-lazy-img' ) ) {

						target.src		= target.dataset.src;
						target.srcset	= target.dataset.srcset;
						target.sizes	= target.dataset.sizes;

						target.classList.remove( '.cmt-lazy-img' );
					}
					else {
						
						var width	= window.innerWidth;
						var srcset	= target.dataset.srcset.split( ',' );
						var sizes	= target.dataset.sizes.split( ',' );

						if( width > parseInt( sizes[ 0 ] ) ) {

							target.style.backgroundImage = "url('" + srcset[ 0 ] + "')"; 
						}
						else if( width > parseInt( sizes[ 1 ] ) ) {

							target.style.backgroundImage = "url('" + srcset[ 1 ] + "')"; 
						}
						else {
							
							target.style.backgroundImage = "url('" + srcset[ 2 ] + "')"; 
						}
					}

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
		initLazyListener( images );
	}
}

function initLazyListener( images ) {

	// Flag to relax the listener from continuous checking
	var active = false;

	// The actual listener to listen for scroll, resize and change in viewport orientation
	var lazyLoadListener = function() {

		if( active === false ) {

			active = true;

			setTimeout( function() {

				// Iterate over the images collection for lazy loading
				images.forEach( function( image ) {

					// Window intersection test
					if( ( image.getBoundingClientRect().top <= window.innerHeight && image.getBoundingClientRect().bottom >= 0 ) && getComputedStyle( image ).display !== "none" ) {

						image.src = image.dataset.src;
						image.srcset = image.dataset.srcset;

						// Done lazy loading
						image.classList.remove( '.cmt-lazy-img' );

						// Remove from collection
						images = images.filter( function( img ) {

							return image !== img;
						});

						// Stop lazy loading
						if( images.length === 0 ) {

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
