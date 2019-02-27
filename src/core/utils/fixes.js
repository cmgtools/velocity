// Inheritance - Crockford's approach to add inheritance. It works for all browsers. 
// Object.create() is standard way to support inheritance, but still not supported by all browsers.

// == Crockford's Inheritance =============

Function.prototype.inherits = function( parent ) {

	var d = 0;
	var p = ( this.prototype = new parent() );

	this.prototype.uber	= function( name ) {

		var f;
		var r;
		var t = d;
		var v = parent.prototype;

		if( t ) {

			while( t ) {

	              v  = v.constructor.prototype;
	              t -= 1;
			}

			f = v[ name ];
		}
		else {

			f = p[ name ];

			if( f == this[ name ] ) {

				f = v[ name ];
			}
		}

		d += 1;
		r  = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
		d -= 1;

		return r;
	};
};

// == Hash Tag - Clear - SNS Login ========

if( window.location.hash == '#_=_' ) {

    if( history.replaceState ) {

        var cleanHref = window.location.href.split( '#' )[ 0 ];

        history.replaceState( null, null, cleanHref );
    }
    else {

        window.location.hash = '';
    }
}

// == Object Size =========================

// Static method to get the size of associative arrays
Object.size = function( arr ) {

    var size = 0;

	// Iterate over all properties
    for( var key in arr ) {

        if( arr.hasOwnProperty( key ) ) {
			
			size++;
		}
    }

    return size;
};
