// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
var Bomb = require( './bomb' );
var Coords = require( './coords' );


// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
var _private = {
    totalPlayers: 0
};


// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function Player( options ) {
    _private.totalPlayers++;

    this.id = ( Math.floor( Math.random() * 1000000 ) + '' ).substring( 0, 5 );
    this.num = _private.totalPlayers;
    this.node = _buildPlayerNode( { id: this.id, num: this.num } );
    this.coords = new Coords( { coords: options.coords } );

    this.inventory = {};
    this.lives = 3; /// TEMP

    /// TODO[@jrmykolyn] - Make this... better.
    this.inventory.bombs = [ new Bomb(), new Bomb(), new Bomb() ];

    return this;
}


Player.prototype.hasInventory = function( key ) {
    return !!( this.inventory[ key ] && Array.isArray( this.inventory[ key ] ) && this.inventory[ key ].length );
}


Player.prototype.fetchBomb = function( options ) {
    options = options || {};

    _emitPlayerFetchedBomb( this );

    var bomb = this.inventory.bombs.pop();

    bomb.set( 'coords', options.coords || null );

    return bomb
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
function _buildPlayerNode( options ) {
    var node = document.createElement( 'div' );

    node.classList.add( 'player' );
    node.setAttribute( 'data-id', options.id );
    node.setAttribute( 'data-num', options.num );

    return node;
}

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