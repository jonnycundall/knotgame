(function () {
    "use strict";
    var showPlayAgain, playAgain, drawingCanvas, drawingContext, game, currentGame, doc,
        cord, area, input, intervalId, renderer, gameInterface;
    
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
        var face = {}, newDirection;
        face.move = function (input) {
            newDirection = snake.move(input);
            input.setDirection(newDirection);
            if (snake.dead === true) {
                return STATE_DEAD;
            }
            return STATE_ALIVE;
        }
            
        face.start = function (input) {
            snake.reset();
            return STATE_ALIVE;
        }
        return face;
    }
    
    game = function () {
        var newDirection, action, face, state;
        area = gameArea(drawingCanvas);
        renderer = initializeRenderer(drawingCanvas, area);
        cord = snake(renderer, area);
        face = gameInterface(cord);
        state = stateMachine(face);
        intervalId = setInterval(function () {
            state.do(input);
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



