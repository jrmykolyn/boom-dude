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

    // Instantiate 'Grid' entities.
    var grid = new Grid( { count: 10, defaultValue: null } );
    var bombGrid = new Grid( { count: 10, defaultValue: null } );

    // Instantiate 'Player' entities.
    var player1 = new Player( { coords: [ 0, 0 ] } );
    var player2 = new Player( { coords: [ grid.getHeight(), grid.getWidth() ] } );

    // Add 'Player' entities to 'Game' object.
    game.players.push( player1 );
    game.players.push( player2 );

    // Add 'Player; entities to 'Grid' object.
    grid.set( player1, [ 0, 0 ] );
    grid.set( player2, [ grid.getHeight(), grid.getWidth() ] );

    // Instantiate 'View' entity.
    var view = new View( { targetId: 'uiWrapper' } );
    view.buildPlayerUI( player1 );
    view.buildPlayerUI( player2 );

    // Inject 'Terrain' instances into `grid`.
    for ( var i = 0, x = 30; i < x; i++ ) {
        var options = {};
        options.indestructible = !!( Math.round( Math.random() ) );

        var t = new Terrain( options );
        grid.insert( t );
    }

    // Build 'grid' HTML.
    var gridHTML = view.buildGrid( { grid: grid, wrapperId: 'gridWrapper' } );

    // Insert 'Player' nodes.
    view.insertNode( 'gridWrapper', player1, [ 0, 0 ] );
    view.insertNode( 'gridWrapper', player2, [ grid.getHeight(), grid.getWidth() ] );


    // --------------------------------------------------
    // DECLARE FUNCTIONS
    // --------------------------------------------------


    // --------------------------------------------------
    // PRIVATE FUNCTIONS
    // --------------------------------------------------
    /// TODO[@jrmykolyn] - Move function into `Game` entity/class.
    function _emitGameOver() {
        var e = new Event( 'BD_GAME_OVER' );
        window.dispatchEventEvent( e );
    }


    // --------------------------------------------------
    // EVENTS
    // --------------------------------------------------
    window.addEventListener( 'BD_PLAYER_MOVE', function( e ) {
        // Pull 'Player' and options data out of event.
        var player = e.data.player;
        var options = e.data.options;

        // Assign coords-related vars.
        var currCoords = player.coords.get();
        var newCoords = player.coords.get( options );

        if (
            grid.validateCoords( newCoords )
            && !grid.getEntityAtCoords( newCoords )
            && !bombGrid.getEntityAtCoords( newCoords )
        ) {
            // Update 'grid'
            /// TODO[@jrmykolyn] - Update 'Grid' to include '.move( currCoords, newCoords )' method.
            grid.set( null, currCoords );
            grid.set( player, newCoords );

            // Update 'Player' coords.
            player.coords.set( newCoords );

            // Update view.
            view.shiftNode( player, options.offset.direction );
        }
    } ); // /BD_PLAYER_MOVE


    window.addEventListener( 'BD_PLAYER_FETCHED_BOMB', function( e ) {
        console.log( e );

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


        // Remove 'Bomb' entity.
        bombGrid.set( null, e.data.coords );

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
                if ( entity instanceof Player ) {
                    entity.kill();
                } else {
                    // Remove `entity` from `grid`.
                    grid.set( null, coords );

                    // Remove entity from 'view'.
                    view.removeNode( entity );
                }
            }


        } );
    } ); // /BD_BOOM


    window.addEventListener( 'keyup', function( e ) {
        if ( !game.state.isOver ) {
            switch ( e.keyCode ) {
                case 32: // Player 1 > BOMB ( Spacebar )
                    if ( player1.hasInventory( 'bombs' ) ) {
                        var pos = grid.getPositionOf( player1.id );
                        var bomb = player1.fetchBomb( { coords: pos } );

                        // Add `bomb` to `bombGrid`.
                        bombGrid.set( bomb, pos );

                        // Add 'bomb' to 'view'.
                        view.insertNode( 'gridWrapper', bomb, bomb.coords );

                        // Start `bomb` countdown.
                        bomb.arm();
                    }

                    break;
                case 65: // Player 1 > LEFT
                    var e = new Event( 'BD_PLAYER_MOVE' );
                    e.data = {
                        player: player1,
                        options: {
                            offset: { direction: 'left', distance: -1 }
                        }
                    };

                    window.dispatchEvent( e );
                    break;
                case 87: // Player 1 > UP
                    var e = new Event( 'BD_PLAYER_MOVE' );
                    e.data = {
                        player: player1,
                        options: {
                            offset: { direction: 'up', distance: -1 }
                        }
                    };

                    window.dispatchEvent( e );

                    break;
                case 68: // Player 1 > RIGHT
                    var e = new Event( 'BD_PLAYER_MOVE' );
                    e.data = {
                        player: player1,
                        options: {
                            offset: { direction: 'right', distance: 1 }
                        }
                    };

                    window.dispatchEvent( e );

                    break;
                case 83: // Player 1 > DOWN
                    var e = new Event( 'BD_PLAYER_MOVE' );
                    e.data = {
                        player: player1,
                        options: {
                            offset: { direction: 'down', distance: 1 }
                        }
                    };

                    window.dispatchEvent( e );

                    break;
                case 18: // Player 2 > BOMB ( Option )
                    if ( player2.hasInventory( 'bombs' ) ) {
                        var pos = grid.getPositionOf( player2.id );
                        var bomb = player2.fetchBomb( { coords: pos } );

                        // Add `bomb` to `bombGrid`.
                        bombGrid.set( bomb, pos );

                        // Add 'bomb' to 'view'.
                        view.insertNode( 'gridWrapper', bomb, bomb.coords );

                        // Start `bomb` countdown.
                        bomb.arm();
                    }

                    break;
                case 37: // Player 2 > LEFT
                    var e = new Event( 'BD_PLAYER_MOVE' );
                    e.data = {
                        player: player2,
                        options: {
                            offset: { direction: 'left', distance: -1 }
                        }
                    };

                    window.dispatchEvent( e );

                    break;
                case 38: // Player 2 > UP
                    var e = new Event( 'BD_PLAYER_MOVE' );
                    e.data = {
                        player: player2,
                        options: {
                            offset: { direction: 'up', distance: -1 }
                        }
                    };

                    window.dispatchEvent( e );

                    break;
                case 39: // Player 2 > RIGHT
                    var e = new Event( 'BD_PLAYER_MOVE' );
                    e.data = {
                        player: player2,
                        options: {
                            offset: { direction: 'right', distance: 1 }
                        }
                    };

                    window.dispatchEvent( e );

                    break;
                case 40: // Player 2 > DOWN
                    var e = new Event( 'BD_PLAYER_MOVE' );
                    e.data = {
                        player: player2,
                        options: {
                            offset: { direction: 'down', distance: 1 }
                        }
                    };

                    window.dispatchEvent( e );

                    break;
                default:
                    // DO NO THINGS;
            }
        }
    } ); // /keyup
} )( window, document );