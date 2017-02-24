// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function Bomb() {
    this.id = ( Math.floor( Math.random() * 1000000 ) + '' ).substring( 0, 5 );

    return this;
} // /Bomb()


Bomb.prototype.arm = function( options ) {
    options = options || {};
    
    var _this = this;

    setTimeout( function() {
        var el = document.querySelectorAll( '[data-id="' + _this.id + '"]' )[ 0 ];

        if ( el ) { el.parentNode.removeChild( el ); }
    }, options.timer || 2000 );

    return true;
} // /arm()


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Bomb;