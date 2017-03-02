// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function Coords( options ) {
    options = options || {};

    this.coords = options.coords; /// TEMP

    return this;
}


Coords.prototype.get = function( options ) {
    options = options || {};

    if ( !options.offset || typeof options.offset !== 'object' ) {
        return this.coords;
    }

    var targetIndex = null;
    var newCoords = this.coords.slice( 0 );

    switch ( options.offset.direction ) {
        case 'up':
        case 'down':
            targetIndex = 0;
            break;
        case 'left':
        case 'right':
            targetIndex = 1;
            break;
        default:
            // DO NO THINGS;
    }

    newCoords[ targetIndex ] = ( newCoords[ targetIndex ] + options.offset.distance );

    return newCoords;
} // /get()


Coords.prototype.set = function( coords ) {
    coords = coords || null;

    if ( !coords || !Array.isArray( coords ) || !coords.length ) {
        return null;
    }

    this.coords = coords;

    return true;
}


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Coords;