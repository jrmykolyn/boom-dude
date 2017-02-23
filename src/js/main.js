var Grid = require( './grid' );
var Player = require( './player' );


( function( window, document ) {
    // --------------------------------------------------
    // DECLARE VARS
    // --------------------------------------------------
    var player = document.getElementsByClassName( 'player' )[ 0 ];
    var gridElem = document.getElementsByClassName( 'grid' )[ 0 ];

    var grid = new Grid( { count: 5, defaultValue: null } );
    var player1 = new Player();

    grid.insert( player1 );

    var playerPos = [ 0, 0 ];
    var playerPosNew = [];

    var inventory = {
        bombs: 3
    };



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

            gridElem.appendChild( bombElem );

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
                maxVal = gridElem.clientHeight;
                moveDir = 'v';

                break;
            case 'left':
                mod = -1;
            case 'right':
                prop = 'left';
                maxVal = gridElem.clientWidth;
                moveDir = 'h';

                break;
            default:
                // DO NO THINGS;
        }

        currVal = parseInt( player.style[ prop ] ) || 0;
        newVal = ( currVal + ( mod * 100 ) );

        if ( newVal >= 0 && newVal < maxVal ) {
            player.style[ prop ] = newVal + 'px';

            // Update position within `gridData`:
            playerPosNew = playerPos.slice( 0 );

            if ( moveDir === 'v' ) {
                playerPosNew[ 0 ] = ( mod !== -1  ) ? ( playerPos[ 0 ] + 1 ) : ( playerPos[ 0 ] - 1 );
            } else {
                playerPosNew[ 1 ] = ( mod !== -1  ) ? ( playerPos[ 1 ] + 1 ) : ( playerPos[ 1 ] - 1 );
            }

            // Clear original position:
            // gridData[ playerPos[ 0 ] ][ playerPos[ 1 ] ] = null;

            // Occupy new position:
            // gridData[ playerPosNew[ 0 ] ][ playerPosNew[ 1 ] ] = 1;

            playerPos = playerPosNew;
        }
    }

    // EVENTS
    window.addEventListener( 'keyup', function( e ) {
        console.log( e.keyCode );

        switch ( e.keyCode ) {
            case 32: /// SPACE
                placeBomb();

                break;
            case 37:
                console.log( 'MOVE LEFT' ); /// TEMP
                movePlayer( player, 'left' );

                break;
            case 38:
                console.log( 'MOVE UP' ); /// TEMP
                movePlayer( player, 'up' );

                break;
            case 39:
                console.log( 'MOVE RIGHT' ); /// TEMP
                movePlayer( player, 'right' );

                break;
            case 40:
                console.log( 'MOVE DOWN' ); /// TEMP
                movePlayer( player, 'down' );

                break;
            default:
                // DO NO THINGS;
        }
    } );
} )( window, document );