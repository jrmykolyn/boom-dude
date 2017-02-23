function Player( options ) {
    this.id = ( Math.floor( Math.random() * 1000000 ) + '' ).substring( 0, 5 );

    return this;
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Player;