var gameArea, initializeRenderer, snake;
//the gameArea object is responsible for mapping between physical coordinates on the canvas 
//and logical coordinates in the game 
gameArea = function (canvas) {
    "use strict";
    var gridSquareSize, area, height, width, randomPosition;
    // game would be too small to draw on canvas
    if (canvas.height < 50 || canvas.width < 50) {
        return;
    }
    
    gridSquareSize = Math.max(Math.floor(canvas.height / 30), Math.floor(canvas.width / 30));
    
    height = Math.min(Math.floor(canvas.height / gridSquareSize), 30);
    width = Math.min(Math.floor(canvas.width / gridSquareSize), 30);
    
    randomPosition  = function (dimension) {
        return Math.floor(Math.random() * dimension);
    };

    area = {
        height: height,
        width: width,
        
        point: function (logicalPointX, logicalPointY) {
            return [logicalPointX * gridSquareSize, logicalPointY * gridSquareSize];
        },
        randomPoint: function () {
            return [randomPosition(width), randomPosition(height)];
        }
    };
    
    return area;
};

// given rendering commands by the game object, this draws them on the canvas 
// using the drawingContext
initializeRenderer = function (context, gameArea) {
    "use strict";
    var renderer = {};
    
    //skeleton method - I'll implement some game objects first
    renderer.drawCurve = function (pointArray, startCondition, endCondition) {
        console.log('drawcurve ' + pointArray[0] + ' ' + startCondition + endCondition);
    };
    
    return renderer;
};
    
snake = function (renderer, gameArea) {
    "use strict";
    var head, tail, obj;
    head = gameArea.randomPoint();
    
    obj = {};
    obj.move = function () { console.log('move'); };
    return obj;
};