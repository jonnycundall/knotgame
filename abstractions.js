var gameArea, initializeRenderer, snake, userInput, directionGuider,
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
    
snake = function (renderer, gameArea) {
    "use strict";
    var head, tail, obj, nextSquare, maxLength, guider;
    head = gameArea.randomPoint();
    tail = [];
    maxLength = 20;
    guider = directionGuider(gameArea);
    
    nextSquare = function (direction) {
        if (!direction) {
            return;
        }
        var newX, newY;
        newX = head[0] + direction[0];
        newY = head[1] + direction[1];
        return [newX, newY];
    };
    
    obj = {};
    
    obj.move = function (direction) {
        var nextPosition;
        direction = guider.correctDirection(direction, head);
        nextPosition = nextSquare(direction);
        if (nextPosition) {
            tail.splice(0,0,head);
            head = nextPosition;
        }
        tail = tail.slice(0, maxLength);
    };
    
    obj.draw = function () {
        renderer.drawCurve(tail);
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
        
Geometry =  {
    midpoint: function (point1, point2) {
        return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2];
    },
    
    isCollinear: function (point1, point2, point3) {
        var vector1, vector2;
        vector1 = [point2[0] - point1[0], point2[1] - point1[1]];
        vector2 = [point3[0] - point2[0], point3[1] - point2[1]];
        return vector1[0] * vector2[1] - vector1[1] * vector2[0] === 0;
    },
    
    distance: function (point1, point2) {
        return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1]));
    }
};
    
directionGuider = function (area) {
    'use strict';
    var guider = {};
    guider.correctDirection = function (proposedDirection, currentPosition) {
        if (!currentPosition || !proposedDirection) {
            return proposedDirection;
        }
        if (proposedDirection[0] === UP[0] && proposedDirection[1] === UP[1] 
            && currentPosition[1] <= 0) {
            if (currentPosition[0] <= 0) {
                return DOWN;
            }
            return LEFT;
        }
        if (proposedDirection[0] === LEFT[0] && proposedDirection[1] === LEFT[1] 
            && currentPosition[0] <= 0) {
            if (currentPosition[1] >= area.height) {
                return RIGHT;
            }
            return DOWN;
        }
        if (proposedDirection[0] === DOWN[0] && proposedDirection[1] === DOWN[1] 
            && currentPosition[1] >= area.height) {
            if (currentPosition[0] >= area.width) {
                return UP;
            }
            return RIGHT;
        }
        if (proposedDirection[0] === RIGHT[0] && proposedDirection[1] === RIGHT[1] 
            && currentPosition[0] >= area.width) {
            if (currentPosition[1] <= 0) {
                return LEFT;
            }
            return UP;
        }
        return proposedDirection;
    };
    return guider;
};