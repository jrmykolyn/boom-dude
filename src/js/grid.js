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


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Grid;