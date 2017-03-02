// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------


// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------


// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function Game( options ) {
    options = options || {};

    // Set `state`.
    this.state = {};
    this.state.isOver = false;

    this.players = [];

    return this;
} // /Game()


Game.prototype.addPlayers = function( players ) {
    players = players || null;

    if ( !players || !Array.isArray( players ) || !players.length ) {
        return null;

        /// TODO[@jrmykolyn] - Throw error.
    }

    this.players = this.players.concat( players );

    return this.players;
} // /addPlayers()


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Game;