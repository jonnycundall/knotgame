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
    
    game = function () {
        area = gameArea(drawingCanvas);
        renderer = initializeRenderer(drawingCanvas, area);
        cord = snake(renderer, area);
        
        intervalId = setInterval(function () {
            cord.move(input.direction());
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



