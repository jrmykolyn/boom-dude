( function( window, document ) {

    // DECLARE VARS
    var player = document.getElementsByClassName( 'player' )[ 0 ];

    // DECLARE FUNCTIONS
    function movePlayer( player, direction ) {
        var prop = null;
        var mod = 1;
        var val = null;

        switch ( direction ) {
            case 'up':
                mod = -1;
            case 'down':
                console.log( 'MATCHED "up" || "down".' ); /// TEMP
                console.log( player.style.top ); /// TEMP
                prop = 'top';

                break;
            case 'left':
                mod = -1;
            case 'right':
                console.log( 'MATCHED "left" || "right".' ); /// TEMP
                console.log( player.style.left ); /// TEMP
                prop = 'left';

                break;
            default:
                // DO NO THINGS;
        }

        val = parseInt( player.style[ prop ] ) || 0;

        player.style[ prop ] = ( val + ( mod * 100 ) ) + 'px';
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