var Grid = require( './grid' );
var Player = require( './player' );
var Terrain = require( './terrain' );
var View = require( './view' );


( function( window, document ) {
    // --------------------------------------------------
    // DECLARE VARS
    // --------------------------------------------------
    // 'Game' entity:
    var game = {}

    game.state = {};
    game.state.isOver = false;

    game.players = [];

    // 'Player' entities.
    var player1 = new Player();
    game.players.push( player1 );

    // 'View' entity.
    var view = new View( { targetId: 'uiWrapper' } );
    view.buildPlayerUI( player1 );

    // 'Grid' entities.
    var grid = new Grid( { count: 10, defaultValue: null } );
    var bombGrid = new Grid( { count: 10, defaultValue: null } );

    grid.set( player1, [ 0, 0 ] );

    // Inject 'Terrain' instances into `grid`.
    for ( var i = 0, x = 30; i < x; i++ ) {
        var options = {};
        options.indestructible = !!( Math.round( Math.random() ) );

        var t = new Terrain( options );
        grid.insert( t );
    }

    var inventory = {
        bombs: 3
    };

    // Build HTML
    var playerElem = document.getElementsByClassName( 'player' )[ 0 ];
    var gridWrapper = document.getElementById( 'gridWrapper' );
    var terrainWrapper = document.getElementById( 'terrainWrapper' );
    var bombWrapper = document.getElementById( 'bombWrapper' );

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
        rowHTML.setAttribute( 'data-row', i );

        for ( var j = 0; j < x; j++ ) {
            var cellHTML = document.createElement( 'div' );

            cellHTML.classList.add( 'cell' );
            cellHTML.setAttribute( 'data-row', i );
            cellHTML.setAttribute( 'data-col', j );

            var coords = [ i, j ];
            var currEntity = grid.getEntityAtCoords( coords );

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

            rowHTML.append( cellHTML );
        }

        terrainGridHTML.appendChild( rowHTML );
    }

    terrainWrapper.prepend( terrainGridHTML );
    // Build 'grid terrain' - START


    // Build 'bomb grid' - START
    /// TODO[@jrmykolyn] - Move logic to elsewhere in controller, or into dedicated partial file.
    var bombGridHTML = document.createElement( 'div' );
    bombGridHTML.classList.add( 'grid' );

    /// TODO[@jrmykolyn] - Build out alternative method for fetching grid height.
    for ( var i = 0, x = ( grid.getHeight() + 1 ); i < x; i++ ) {
        var rowHTML = document.createElement( 'div' );

        rowHTML.classList.add( 'row' );

        for ( var j = 0; j < x; j++ ) {
            var cellHTML = document.createElement( 'div' );

            cellHTML.classList.add( 'cell' );
            cellHTML.setAttribute( 'data-row', i );
            cellHTML.setAttribute( 'data-col', j );

            rowHTML.append( cellHTML );
        }

        bombGridHTML.appendChild( rowHTML );
    }

    bombWrapper.prepend( bombGridHTML );
    // Build 'bomb grid' - START

    // --------------------------------------------------
    // DECLARE FUNCTIONS
    // --------------------------------------------------
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


    // --------------------------------------------------
    // PRIVATE FUNCTIONS
    // --------------------------------------------------
    /// TODO[@jrmykolyn] - Move function into `Game` entity/class.
    function _emitGameOver() {
        var e = new Event( 'BD_GAME_OVER' );
        window.dispatchEvent( e );
    }


    // --------------------------------------------------
    // EVENTS
    // --------------------------------------------------
    window.addEventListener( 'BD_PLAYER_FETCHED_BOMB', function( e ) {
        view.removePlayerElem( e.data, 'bomb' );
    } ); // /BD_PLAYER_FETCHED_BOMB


    window.addEventListener( 'BD_PLAYER_DIED', function( e ) {
        view.removePlayerElem( e.data, 'life' );
    } ); // /BD_PLAYER_DIED


    window.addEventListener( 'BD_PLAYER_LOST', function( e ) {
        console.log( 'GAME OVER FOR PLAYER: ', e.data.id ); /// TEMP

        _emitGameOver();
    } ); // /BD_PLAYER_LOST


    window.addEventListener( 'BD_GAME_OVER', function( e ) {
        game.state.isOver = true;

        view.setOverlayState( true );
    } ); // /BD_PLAYER_LOST


    window.addEventListener( 'BD_BOOM', function( e ) {
        /// TODO[@jrmykolyn]
        // - Validate presence of `coords` on `e.data`.
        // - Get adjacent coords.
        // - Check for presence of entities at adjacent coords.
        // - Remove entities (if applicable).

        console.log( 'INSIDE `BD_BOOM` EVENT HANDLER' ); /// TEMP

        console.log( 'LOGGING `e.data.coords`' ); /// TEMP
        console.log( e.data.coords ); /// TEMP

        /// TEMP
        var upCoords = bombGrid.adjustCoords( e.data.coords.slice(), 'up' );
        var rightCoords = bombGrid.adjustCoords( e.data.coords.slice(), 'right' );
        var downCoords = bombGrid.adjustCoords( e.data.coords.slice(), 'down' );
        var leftCoords = bombGrid.adjustCoords( e.data.coords.slice(), 'left' );

        /// TEMP - Arr of 'bomb' coords, plus adjacent coords.
        coordsArr = [ e.data.coords.slice(), upCoords, rightCoords, downCoords, leftCoords ];

        /// TEMP
        coordsArr.forEach( function( coords ) {
            console.log( 'CHECKING FOR ENTITY AT COORDS:', coords );

            var entity = grid.getEntityAtCoords( coords );

            if ( entity && !entity.indestructible ) {
                // Remove `entity` from `grid`.
                grid.set( null, coords );

                // Remove entity from 'view'.
                view.removeNode( entity );
            }

            if ( entity instanceof Player ) {
                entity.kill();
            }
        } );
    } ); // /BD_BOOM


    window.addEventListener( 'keyup', function( e ) {
        if ( !game.state.isOver ) {
            switch ( e.keyCode ) {
                case 32: /// SPACE
                    if ( player1.hasInventory( 'bombs' ) ) {
                        var bomb = player1.getBomb();
                        var pos = grid.getPositionOf( player1.id );

                        // Add `bomb` to `bombGrid`.
                        bombGrid.set( bomb, pos );

                        // Build and insert `bomb` HTML.
                        var cellElem = bombGridHTML.querySelectorAll( '[data-row="' + pos[ 0 ] + '"][data-col="' + pos[ 1 ] + '"]' )[ 0 ];
                        var bombElem = document.createElement( 'div' );

                        bombElem.classList.add( 'bomb' );
                        bombElem.setAttribute( 'data-id', bomb.id );

                        cellElem.appendChild( bombElem );

                        // Start `bomb` countdown.
                        bomb.arm();

                        /// TODO[@jrmykolyn] - Figure out more elegant way to inject this info. Shouldn't be separate step.
                        bomb.set( 'coords', pos );
                    }

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
        }
    } ); // /keyup
} )( window, document );