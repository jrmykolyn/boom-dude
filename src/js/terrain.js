function Terrain( options ) {
    options = options || {};

    this.id = ( Math.floor( Math.random() * 1000000 ) + '' ).substring( 0, 5 );

    for ( var key in options ) {
        if ( options.hasOwnProperty( key ) && this[ key ] === undefined ) {
            this[ key ] = options[ key ];
        }
    }

    return this;
}


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Terrain;