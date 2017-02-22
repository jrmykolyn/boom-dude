( function( window, document ) {

    // DECLARE VARS
    var player = document.getElementsByClassName( 'player' )[ 0 ];
    var gridElem = document.getElementsByClassName( 'grid' )[ 0 ];
    var gridData = makeArr( 5, makeArr( 5, null ) );
    var playerPos = [ 0, 0 ];
    var playerPosNew = [];

    gridData[ playerPos[ 0 ] ][ playerPos[ 1 ] ] = 1;

    console.log( gridData ); /// TEMP

    // DECLARE FUNCTIONS
    function makeArr( length, value ) {
        var arr = [];

        for ( var i = 0, x = length; i < x; i++ ) {
            if ( !Array.isArray( value ) ) {
                arr.push( value );
            } else {
                arr.push( value.slice( 0 ) );
            }
        }

        return arr;
    }

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

            // Upgdate position within `gridData`:
            playerPosNew = playerPos.slice( 0 );

            if ( moveDir === 'v' ) {
                playerPosNew[ 0 ] = ( mod !== -1  ) ? ( playerPos[ 0 ] + 1 ) : ( playerPos[ 0 ] - 1 );
            } else {
                playerPosNew[ 1 ] = ( mod !== -1  ) ? ( playerPos[ 1 ] + 1 ) : ( playerPos[ 1 ] - 1 );
            }

            // Clear original position:
            gridData[ playerPos[ 0 ] ][ playerPos[ 1 ] ] = null;

            // Occupy new position:
            gridData[ playerPosNew[ 0 ] ][ playerPosNew[ 1 ] ] = 1;

            playerPos = playerPosNew;
        }
    }

    // EVENTS
    window.addEventListener( 'keyup', function( e ) {
        switch ( e.keyCode ) {
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