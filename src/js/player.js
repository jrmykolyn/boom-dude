// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
var Bomb = require( './bomb' );


// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function Player( options ) {
    this.id = ( Math.floor( Math.random() * 1000000 ) + '' ).substring( 0, 5 );
    this.inventory = {};

    /// TODO[@jrmykolyn] - Make this... better.
    this.inventory.bombs = [ new Bomb(), new Bomb(), new Bomb() ];

    return this;
}


Player.prototype.hasInventory = function( key ) {
    return !!( this.inventory[ key ] && Array.isArray( this.inventory[ key ] ) && this.inventory[ key ].length );
}


Player.prototype.getBomb = function() {
    return this.inventory.bombs.pop();
}


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Player;