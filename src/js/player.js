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
    this.lives = 3; /// TEMP

    /// TODO[@jrmykolyn] - Make this... better.
    this.inventory.bombs = [ new Bomb(), new Bomb(), new Bomb() ];

    return this;
}


Player.prototype.hasInventory = function( key ) {
    return !!( this.inventory[ key ] && Array.isArray( this.inventory[ key ] ) && this.inventory[ key ].length );
}


Player.prototype.getBomb = function() {
    _emitPlayerFetchedBomb( this );

    return this.inventory.bombs.pop();

}


Player.prototype.kill = function() {
    this.lives--;

    _emitPlayerDied( this );

    if ( !this.lives ) {
        _emitPlayerLost( this );
    }
}


// --------------------------------------------------
// PRIVATE FUNCTIONS
// --------------------------------------------------
function _emitPlayerDied( data ) {
    data = data || {};

    var e = new Event( 'BD_PLAYER_DIED' );

    e.data = data;

    window.dispatchEvent( e );
} // /_emitPlayerDied()


function _emitPlayerLost( data ) {
    data = data || {};

    var e = new Event( 'BD_PLAYER_LOST' );

    e.data = data;

    window.dispatchEvent( e );
} // /_emitPlayerLost()


function _emitPlayerFetchedBomb( data ) {
    data = data || {};

    var e = new Event( 'BD_PLAYER_FETCHED_BOMB' );

    e.data = data;

    window.dispatchEvent( e );
} // /_emitPlayerFetchedBomb()


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Player;