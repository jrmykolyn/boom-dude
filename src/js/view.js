// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
var Player = require( './player' );


// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function View( options ) {
    options = options || {};

    this.targetId = options.targetId || 'uiWrapper';
    this.targetNode = document.getElementById( this.targetId );

    return this;
} // /View()


View.prototype.buildPlayerUI = function( player ) {
    if ( !player || !player instanceof Player ) {
        /// TODO[@jrmyolyn] - Throw error... or something.

        return null;
    }

    console.log( 'INSIDE `buildPlayerUI()`' );
    console.log( this );
    
    var playerSection = document.createElement( 'div' );
    playerSection.classList.add( 'player-ui' );
    playerSection.setAttribute( 'data-id', player.id );

    // ...
    var livesSection = document.createElement( 'ul' );
    livesSection.classList.add( 'ui-section--lives' );

    // ...
    for ( var i = 0, x = player.lives; i < x; i++ ) {
        // ...
        var itemWrap = document.createElement( 'li' );
        itemWrap.classList.add( 'item-wrap' );
        
        // ...
        var item = document.createElement( 'span' );
        item.classList.add( 'item--life' );

        // ...
        itemWrap.appendChild( item );

        // ...
        livesSection.appendChild( itemWrap );
    }

    // ...
    var bombsSection = document.createElement( 'ul' );
    bombsSection.classList.add( 'ui-section--inventory' );

    // ...
    for ( var i = 0, x = player.lives; i < x; i++ ) {
        // ...
        var itemWrap = document.createElement( 'li' );
        itemWrap.classList.add( 'item-wrap' );

        // ...
        var item = document.createElement( 'span' );
        item.classList.add( 'item--bomb' );

        // ...
        itemWrap.appendChild( item );

        // ...
        bombsSection.appendChild( itemWrap );
    }

    playerSection.appendChild( livesSection );
    playerSection.appendChild( bombsSection );

    this.targetNode.appendChild( playerSection );
} // /buildPlayerUI()


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = View;