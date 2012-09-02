var initializeGameArea, initializeRenderer;
//the gameArea object is responsible for mapping between physical coordinates on the canvas 
//and logical coordinates in the game 
initializeGameArea = function (canvas) {
    "use strict";
    var gridSquareSize, gameArea;
    // game would be too small to draw on canvas
    if (canvas.height < 50 || canvas.width < 50) {
        return;
    }
    
    gridSquareSize = Math.max(Math.floor(canvas.height / 30), Math.floor(canvas.width / 30));
    
    gameArea = {
        height: Math.min(Math.floor(canvas.height / gridSquareSize), 30),
        width: Math.min(Math.floor(canvas.width / gridSquareSize), 30),
        
        point: function (logicalPointX, logicalPointY) {
            return [logicalPointX * gridSquareSize, logicalPointY * gridSquareSize];
        }
    };
    
    return gameArea;
};

// given rendering commands by the game object, this draws them on the canvas 
// using the drawingContext
initializeRenderer = function (context, gameArea) {
    var renderer = {};
    
    //skeleton method - I'll implement some game objects first
    renderer.drawCurve = function (pointArray, startCondition, endCondition){
        console.log('drawcurve ' + pointArray[0] + ' ' + startCondition + endCondition);
    }
    
    return renderer;
}