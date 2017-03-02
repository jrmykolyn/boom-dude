// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
var Player = require( './player' );
var Terrain = require( './terrain' );


// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function View( options ) {
    options = options || {};

    this.targetId = options.targetId || 'uiWrapper';
    this.targetNode = document.getElementById( this.targetId );
    this.grid = {};

    return this;
} // /View()


View.prototype.buildGrid = function( options ) {
    options = options || {};

    var grid = options.grid || null;
    var wrapperId = options.wrapperId || null;

    if ( !grid || !wrapperId ) {
        return null;

        /// TODO[@jrmykolyn] - Throw error.
    }

    var gridWrapper = document.getElementById( wrapperId );
    var gridHTML = document.createElement( 'div' );

    gridHTML.classList.add( 'grid' );

    /// TODO[@jrmykolyn] - Build out alternative method for fetching grid height.
    for ( var i = 0, x = ( grid.getHeight() + 1 ); i < x; i++ ) {
        var rowHTML = document.createElement( 'div' );

        rowHTML.classList.add( 'row' );
        rowHTML.setAttribute( 'data-row', i );

        for ( var j = 0; j < x; j++ ) {
            var coords = [ i, j ];
            var currEntity = grid.getEntityAtCoords( coords );
            var cellHTML = document.createElement( 'div' );

            cellHTML.classList.add( 'cell' );
            cellHTML.classList.add( 'tile' );
            cellHTML.setAttribute( 'data-row', i );
            cellHTML.setAttribute( 'data-col', j );

            // Build and insert `Terrain` nodes.
            if ( currEntity && currEntity instanceof Terrain ) {
                var entityHTML = document.createElement( 'div' );

                entityHTML.classList.add( 'entity' );
                entityHTML.classList.add( 'terrain' );
                entityHTML.setAttribute( 'data-id', currEntity.id );

                // If the current entity *IS* indestructible, add a supplementary class.
                if ( currEntity.indestructible ) {
                    entityHTML.classList.add( 'indestructible' );
                }

                cellHTML.appendChild( entityHTML );
            }

            rowHTML.appendChild( cellHTML );
        }

        gridHTML.appendChild( rowHTML );
    }

    gridWrapper.prepend( gridHTML );

    // Capture `grid` data and node as instance properties.
    this.grid.data = grid;
    this.grid.node = gridHTML;

    /// TEMP - Return node to outer context. Moving forward, all interactions with DOM nodes should be done via the `View` API.
    return this.grid.node;
} // /buildGrid()


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
    livesSection.setAttribute( 'data-section-type', 'life' );

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
    bombsSection.setAttribute( 'data-section-type', 'bomb' );

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


View.prototype.removePlayerElem = function( player, elem ) {
    if ( !player || !player instanceof Player || !elem ) {
        return null;
    }

    var playerSection = document.querySelector( '.player-ui[data-id="' + player.id + '"]' );
    var uiSection = playerSection.querySelector( '[data-section-type="' + elem + '"]');

    uiSection.removeChild( uiSection.lastChild );
} // /removePlayerElem()


View.prototype.setOverlayState = function( isActive ) {
    isActive = ( isActive && typeof isActive === 'boolean' );

    var overlayElem = document.getElementById( 'overlay' );

    if ( isActive ) {
        overlayElem.classList.add( 'is-active' );
    } else {
        overlayElem.classList.remove( 'is-active' );
    }
} // /setOverlayState()


View.prototype.insertNode = function( wrapperId, entity, coords ) {
    wrapperId = wrapperId || null;
    entity = entity || null;
    coords = coords || null;

    var el = cell = null;

    if ( !wrapperId || !entity || !entity.node || !coords || !Array.isArray( coords ) ) {
        return null;
    }

    el = document.getElementById( wrapperId );

    if ( el ) {
        cell = el.querySelector( '[data-row="' + coords[ 0 ] + '"][data-col="' + coords[ 1 ] + '"]' );
    }

    if ( cell ) {
        cell.appendChild( entity.node );

        return true;
    }

    return false;
} // /insertNode()


View.prototype.removeNode = function( entity ) {
    entity = entity || null;

    if ( !entity || !entity.id ) { return null; }

    var el = document.querySelector( '[data-id="' + entity.id + '"]' );

    if ( el ) {
        el.parentNode.removeChild( el );

        return true;
    }

    return false;
} // /removeNode()


View.prototype.shiftNode = function( entity, direction ) {
    entity = entity || null;

    if ( !entity || typeof entity !== 'object' || !entity.node ) {
        return null;

        /// TODO[@jrmykolyn] - Throw error.
    }

    var prop = null;
    var mod = 1;
    var currVal = null;
    var newVal = null;

    switch ( direction ) {
        case 'up':
            mod = -1;
        case 'down':
            prop = 'top';

            break;
        case 'left':
            mod = -1;
        case 'right':
            prop = 'left';

            break;
        default:
            // DO NO THINGS;
    }

    currVal = parseInt( entity.node.style[ prop ] ) || 0;
    newVal = ( currVal + ( mod * ( this.grid.node.clientHeight / ( this.grid.data.getWidth() + 1 ) ) ) ); /// TODO[@jrmykolyn] - Split this logic up across multiple lines/assignments.

    entity.node.style[ prop ] = newVal + 'px';
}


// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = View;