/// TODO[@jrmykolyn] - Move into  `Utils` module.
function makeArr( length, value ) {
    var arr = [];

    for ( var i = 0, x = length; i < x; i++ ) {
        if ( !Array.isArray( value ) ) {
            arr.push( value );
        } else {
            arr.push( value.slice( 0 ) );
        }
    }

    return arr;
} // /makeArr()


function Grid( options ) {
    options = options || {};

    var count = options.count || 10;
    var defaultValue = options.default || null;

    this.grid = makeArr( count, makeArr( count, defaultValue ) );

    return this;
} // /Grid()


Grid.prototype.update = function( value, coords ) {
    value = value || null;
    coords = coords || null;

    // Validate args.
    if ( !value || !coords ) { return null; }

    // Update grid if selected position is not occupied.
    if ( !this.grid[ coords[ 0 ] ][ coords[ 1 ] ] ) {
        this.grid[ coords[ 0 ] ][ coords[ 1 ] ] = value;

        return true;
    }

    // Return `false` if unable to update grid.
    return false;
} // /update()


/// TODO[@jrmykolyn] - Update function to dynamically insert `entity` in unoccupied space.
Grid.prototype.insert = function( entity ) {
    this.update( entity, [ 0, 0 ] );
} // /insert()


Grid.prototype.set = function( value, coords ) {
    value = value || null;
    coords = coords || null;

    if ( !coords || !Array.isArray( coords ) ) {
        return null;
    }

    this.grid[ coords[ 0 ] ][ coords[ 1 ] ] = value;

    return true;
} // /set()




Grid.prototype.getPositionOf = function( identifier ) {
    identifier = identifier || null;

    var matchedEntity = false;
    var output = null;
    var rowIndex = null;
    var colIndex = null;

    var _this = this;

    this.grid.forEach( function( row ) {
        rowIndex = _this.grid.indexOf( row );

        row.forEach( function( col ) {
            colIndex = _this.grid[ rowIndex ].indexOf( col );

            if ( !matchedEntity ) {
                /// TODO[@jrmykolyn] - Refactor 2x `if` statements below.
                if ( col === identifier ) {
                    output = [ rowIndex, colIndex ];
                    matchedEntity = true;
                }

                if ( typeof col === 'object' && col !== null && col.id === identifier ) {
                    output = [ rowIndex, colIndex ];
                    matchedEntity = true;
                }
            }
        } );
    } );

    return output;
} // /getPositionOf()


Grid.prototype.getAdjustedPositionOf = function( identifier, direction ) {
    identifier = identifier || null;
    direction = direction || null;

    var pos = this.getPositionOf( identifier );
    var newPos = pos.slice( 0 );
    var mod = 0;
    var targetIndex = null;

    if ( !identifier || !direction || !pos ) {
        return null;
    }

    switch ( direction ) {
        case 'up':
        case 'left':
            mod = -1;

            break;
        case 'down':
        case 'right':
            mod = 1;

            break;
        default:
            // DO NO THINGS;
    }

    targetIndex = ( direction === 'up' || direction === 'down' ) ? 0 : 1;

    newPos[ targetIndex ] = ( pos[ targetIndex ] + mod );

    return newPos;
} // /getAdjustedPositionOf()


Grid.prototype.moveEntity = function( entity, direction ) {
    entity = entity || null;
    direction = direction || null;

    console.log( 'VALIDATE ENTITY' );
    if ( !entity || !direction ) {
        return null;
    }

    console.log( 'GET CURRENT POSITION OF ENTITY' );
    var currPos = this.getPositionOf( entity.id );
    console.log( currPos );

    console.log( 'GET ADJUSTED POSITION OF ENTITY' );
    var newPos = this.getAdjustedPositionOf( entity.id, direction );
    console.log( newPos );

    console.log( 'REMOVE CURRENT ENTITY' );
    var removeResult = this.set( null, currPos ); /// TEMP
    console.log( removeResult );

    console.log( 'CHECK IF ADJUSTED POSITION IS VALID' );
    if ( this.validateCoords( newPos ) ) {
        console.log( 'VALID --> INSERT ENTITY AT NEW POSITION' );

        this.set( entity, newPos );
        return true;
    } else {
        console.log( 'INVALID --> INSERT ENTITY AT OLD POSITION' );

        this.set( entity, currPos );
        return false;
    }
} // /moveEntity()


Grid.prototype.validateCoords = function( coords ) {
    coords = coords || null;

    var isValid = false;

    if ( !coords || !Array.isArray( coords ) ) {
        return null;
    }

    do {
        if ( coords[ 0 ] < 0 || coords[ 1 ] < 0 ) {
            break;
        }

        if ( coords[ 0 ] > this.getHeight() || coords[ 1 ] > this.getWidth() )  {
            break;
        }

        isValid = true;
    } while ( 0 );

    return isValid;
} // /validateCoords()


Grid.prototype.getWidth = function( offset ) {
    var offset = offset || 0;

    return ( this.grid[ 0 ].length -1 ) + offset;
} // /getWidth()


Grid.prototype.getHeight = function( offset ) {
    var offset = offset || 0;

    return ( this.grid.length -1 ) + offset;
} // /getHeight()


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Grid;