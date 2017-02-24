var Grid = require( './grid' );
var Player = require( './player' );
var Terrain = require( './terrain' );


( function( window, document ) {
    // --------------------------------------------------
    // DECLARE VARS
    // --------------------------------------------------
    var playerElem = document.getElementsByClassName( 'player' )[ 0 ];
    var gridWrapper = document.getElementById( 'gridWrapper' );
    var terrainWrapper = document.getElementById( 'terrainWrapper' );

    var grid = new Grid( { count: 10, defaultValue: null } );
    var player1 = new Player();

    grid.set( player1, [ 0, 0 ] );

    // Inject 'Terrain' instances into `grid`.
    for ( var i = 0, x = 10; i < x; i++ ) {
        var t = new Terrain();
        grid.insert( t );
    }

    var inventory = {
        bombs: 3
    };

    // Build 'grid UI' - START
    /// TODO[@jrmykolyn] - Move logic to elsewhere in controller, or into dedicated partial file.
    var gridHTML = document.createElement( 'div' );
    gridHTML.classList.add( 'grid' );

    /// TODO[@jrmykolyn] - Build out alternative method for fetching grid height.
    for ( var i = 0, x = ( grid.getHeight() + 1 ); i < x; i++ ) {
        var rowHTML = document.createElement( 'div' );

        rowHTML.classList.add( 'row' );

        for ( var j = 0; j < x; j++ ) {
            var cellHTML = document.createElement( 'div' );

            cellHTML.classList.add( 'cell' );
            cellHTML.classList.add( 'tile' );

            rowHTML.appendChild( cellHTML );
        }

        gridHTML.appendChild( rowHTML );
    }

    gridWrapper.prepend( gridHTML );
    // Build 'grid UI' - END


    // Build 'grid terrain' - START
    /// TODO[@jrmykolyn] - Move logic to elsewhere in controller, or into dedicated partial file.
    var terrainGridHTML = document.createElement( 'div' );
    terrainGridHTML.classList.add( 'grid' );

    /// TODO[@jrmykolyn] - Build out alternative method for fetching grid height.
    for ( var i = 0, x = ( grid.getHeight() + 1 ); i < x; i++ ) {
        var rowHTML = document.createElement( 'div' );

        rowHTML.classList.add( 'row' );

        for ( var j = 0; j < x; j++ ) {
            var cellHTML = document.createElement( 'div' );

            cellHTML.classList.add( 'cell' );

            var coords = [ i, j ];
            var currEntity = grid.getEntityAtCoords( coords );

            if ( currEntity && currEntity instanceof Terrain ) {
                cellHTML.classList.add( 'terrain' );
            }

            rowHTML.append( cellHTML );
        }

        terrainGridHTML.appendChild( rowHTML );
    }

    terrainWrapper.prepend( terrainGridHTML );

    // Build 'grid terrain' - START

    // --------------------------------------------------
    // DECLARE FUNCTIONS
    // --------------------------------------------------
    function getPlayerLocation() {
        var output = {};

        output.top = parseInt( player.style.top ) || 0;
        output.left = parseInt( player.style.left ) || 0;

        return output;
    }


    function getInventory( item ) {
        item = item || '';

        if ( !item || !inventory[ item ] ) {
            return null;
        }

        return inventory[ item ];
    }


    function updateInventory( item, update ) {
        item = item || '';
        update = update || 0;

        // Validate args.
        if ( !item || !update || !inventory[ item ] ) {
            return null;
        }

        // Update inventory.
        inventory[ item ] += update;

        // Return updated inventory.
        return inventory[ item ];
    }


    function placeBomb() {
        if ( getInventory( 'bombs' ) ) {
            // Create new 'bomb' elem. and add to document.
            var playerCoords =  getPlayerLocation();
            var bombElem = buildBombElement( playerCoords );

            gridHTML.appendChild( bombElem );

            armBomb( bombElem );

            /// TODO[@jrmykolyn]
            // - Update `gridData`.
            // - Handle 'explosion' countdown.

            updateInventory( 'bombs', -1 );
        }
    }


    function buildBombElement( coords ) {
        var el = document.createElement( 'div' );

        el.classList.add( 'bomb' );
        el.style.top = ( coords.top ) + 'px';
        el.style.left = ( coords.left ) + 'px';

        return el;
    }


    function armBomb( bombElem ) {
        setTimeout( function() {
            console.log( 'BOOM!' );
        }, 1000 );
    } // /armBomb()


    function movePlayer( player, direction ) {
        var prop = null;
        var mod = 1;
        var moveDir = null;
        var currVal = null;
        var newVal = null;
        var maxVal = null;

        switch ( direction ) {
            case 'up':
                mod = -1;
            case 'down':
                prop = 'top';
                maxVal = gridHTML.clientHeight;
                moveDir = 'v';

                break;
            case 'left':
                mod = -1;
            case 'right':
                prop = 'left';
                maxVal = gridHTML.clientWidth;
                moveDir = 'h';

                break;
            default:
                // DO NO THINGS;
        }

        currVal = parseInt( player.style[ prop ] ) || 0;
        newVal = ( currVal + ( mod * 50 ) );

        if ( newVal >= 0 && newVal < maxVal ) {
            player.style[ prop ] = newVal + 'px';
        }
    }

    // EVENTS
    window.addEventListener( 'keyup', function( e ) {
        switch ( e.keyCode ) {
            case 32: /// SPACE
                placeBomb();

                break;
            case 37:
                console.log( 'MOVE LEFT' ); /// TEMP

                if ( grid.moveEntity( player1, 'left' ) ) {
                    movePlayer( playerElem, 'left' );
                }

                break;
            case 38:
                console.log( 'MOVE UP' ); /// TEMP

                if ( grid.moveEntity( player1, 'up' ) ) {
                    movePlayer( playerElem, 'up' );
                }

                break;
            case 39:
                console.log( 'MOVE RIGHT' ); /// TEMP

                if ( grid.moveEntity( player1, 'right' ) ) {
                    movePlayer( playerElem, 'right' );
                }

                break;
            case 40:
                console.log( 'MOVE DOWN' ); /// TEMP

                if ( grid.moveEntity( player1, 'down' ) ) {
                    movePlayer( playerElem, 'down' );
                }

                break;
            default:
                // DO NO THINGS;
        }
    } );
} )( window, document );