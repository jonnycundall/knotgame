var gameArea, initializeRenderer, snake, userInput,
    NONE = [0, 0],
    LEFT = [-1, 0],
    DOWN = [0, 1],
    RIGHT = [1, 0],
    UP = [0, -1];
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
    var head, tail, obj, nextSquare;
    head = gameArea.randomPoint();
    tail = [];
    
    nextSquare = function (direction) {
        if (!direction) {
            return;
        }
        var newX, newY;
        newX = (head[0] + direction[0] + gameArea.width) % gameArea.width;
        newY = (head[1] + direction[1] + gameArea.height) % gameArea.height;
        return [newX, newY];
    };
    
    obj = {};
    
    obj.move = function (direction) {
        var nextPosition;
        
        nextPosition = nextSquare(direction);
        if (nextPosition) {
            tail.push(head);
            head = nextPosition;
        }
    };
    
    obj.draw = function () {
        //do stuff with renderer
    };
    
    return obj;
};

//gathers keypresses and stores user instructions implied
userInput = function () {
    "use strict";
    var obj, direction, keyCode;
    
    obj = {};
    obj.keyHandler = function (e) {
        keyCode = e.keyCode;
        e = e || window.event;
        switch (keyCode) {
        case 37:
            direction = LEFT;
            break;
        case 38:
            direction = UP;
            break;
        case 39:
            direction = RIGHT;
            break;
        case 40:
            direction = DOWN;
            break;
        }
    };
    
    obj.direction = function () {
        return direction;
    };
        
    return obj;
};