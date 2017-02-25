// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function Bomb() {
    this.id = ( Math.floor( Math.random() * 1000000 ) + '' ).substring( 0, 5 );
    this.node = _buildBombNode( { id: this.id } );

    return this;
} // /Bomb()


Bomb.prototype.arm = function( options ) {
    options = options || {};

    var _this = this;

    setTimeout( function() {
        _emitBoomEvent( { coords: _this.get( 'coords' ) } );
        _paintBombExplosion( _this.id );
    }, options.timer || 1000 );

    return true;
} // /arm()


Bomb.prototype.set = function( key, value ) {
    this[ key ] = value;
} // /set()


Bomb.prototype.get = function( key ) {
    return this[ key ] || null;
} // /get()


// --------------------------------------------------
// PRIVATE FUNCTIONS
// --------------------------------------------------
function _emitBoomEvent( data ) {
    data = data || {};

    var e = new Event( 'BD_BOOM' );

    e.data = data;

    window.dispatchEvent( e );
}


function _paintBombExplosion( id ) {
    id = id || 0;

    var el = document.querySelectorAll( '[data-id="' + id + '"]' )[ 0 ];
    if ( el ) {
        el.classList.add( 'boom' );

        setTimeout( function() {
            _removeBombNode( id );
        }, 500 );
    }
}


function _removeBombNode( id ) {
    id = id || 0;

    var el = document.querySelectorAll( '[data-id="' + id + '"]' )[ 0 ];
    if ( el ) { el.parentNode.removeChild( el ); }
}


// --------------------------------------------------
// PRIVATE FUNCTIONS
// --------------------------------------------------
function _buildBombNode( options ) {
    var node  = document.createElement( 'div' );

    node.classList.add( 'bomb' );
    node.setAttribute( 'data-id', options.id );

    return node;
}


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Bomb;