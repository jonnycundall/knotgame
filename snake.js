(function () {
    "use strict";
    var showPlayAgain, playAgain, drawingCanvas, drawingContext, game, currentGame, doc,
        cord, area, input, intervalId, renderer;
    
    doc = document;
    showPlayAgain = function () {
        document.getElementById('playAgain').setAttribute('style', '');
    };
        
    playAgain = function () {
        doc.getElementById('playAgain').setAttribute('style', 'visibility: hidden;');
        currentGame = game();
    };
    
    drawingCanvas = doc.getElementById('gameArea');
    
    if (drawingCanvas && drawingCanvas.getContext) {
        drawingContext = drawingCanvas.getContext('2d');
    }
    
    gameInterface = function (snake) {
        var interface = {};
        interface.move = function (input) {
            snake.move(input);
            if (snake.dead === true) {
                return STATE_DEAD;
            }
            return STATE_ALIVE;
        }
            
        interface.start = function (input) {
            snake.reset();
            this.move(input)
        }
        return interface;
    }
    
    game = function () {
        var newDirection, action, interface;
        area = gameArea(drawingCanvas);
        renderer = initializeRenderer(drawingCanvas, area);
        cord = snake(renderer, area);
        interface = gameInterface(cord);
        state = stateMachine(interface);
        intervalId = setInterval(function () {
            state.action(input);
            newDirection = cord.move(input);
            input.setDirection(newDirection);
            input.clearUnderness();
            
            renderer.clear();
            cord.draw();
        },
            300);
    };
    
    showPlayAgain();
    doc.getElementById('playAgainButton').onclick = playAgain;
    input = userInput();
    doc.onkeydown = input.keyHandler;
}());



