var gameArea, initializeRenderer, snake, userInput, directionGuider, snakePiece,
    NONE = [0, 0],
    LEFT = [-1, 0],
    DOWN = [0, 1],
    RIGHT = [1, 0],
    UP = [0, -1];
//the gameArea object is responsible for mapping between physical coordinates on the canvas 
//and logical coordinates in the game 
gameArea = function (canvas) {
    "use strict";
    var gridSquareSize, area, height, width, randomPosition, offset;
    
    // game would be too small to draw on canvas
    if (canvas.height < 50 || canvas.width < 50) {
        return;
    }
    
    gridSquareSize = Math.max(Math.floor(canvas.height / 21), Math.floor(canvas.width / 21));
    offset = Math.floor(gridSquareSize / 2.0);
    height = Math.min(Math.floor(canvas.height / gridSquareSize), 20);
    width = Math.min(Math.floor(canvas.width / gridSquareSize), 20);
    
    randomPosition  = function (dimension) {
        return Math.floor(Math.random() * dimension);
    };

    area = {
        height: height,
        width: width,
        
        point: function (logicalPointX, logicalPointY) {
            return [logicalPointX * gridSquareSize + offset, logicalPointY * gridSquareSize + offset];
        },
        randomPoint: function () {
            return [randomPosition(width), randomPosition(height)];
        },
        inBounds: function (point) {
            return (point[0] >= 0 && point[0] <= width
                && point[1] >= 0 && point[1] <= height);
        },
        gridSquareSize: function () {
            return gridSquareSize;
        }
    };
    
    return area;
};
    
snake = function (renderer, gameArea) {
    "use strict";
    var head, tail, obj, nextSquare, maxLength, guider, overlap;
    head = snakePiece(gameArea.randomPoint(), false);
    tail = [];
    maxLength = 30;
    guider = directionGuider(gameArea);
    
    nextSquare = function (direction) {
        if (!direction) {
            return;
        }
        var newX, newY;
        newX = head.X + direction[0];
        newY = head.Y + direction[1];
        return [newX, newY];
    };
    
    overlap = function (aHead, aTail) {
        var i;
        for (i = 0; i < tail.length; i++) {
            if (Geometry.pointEquals(aTail[i], aHead) === true) {
                tail[i].goUnder = true;   
            }
        }
    };
    
    obj = {};
    
    obj.move = function (input) {
        var nextPosition, lastPosition, direction, exp;
        direction = input.direction();
        if (tail[0]) {
            direction = guider.correctDirection(direction, head.point, tail[0].point);
        }
        nextPosition = nextSquare(direction);
        if (nextPosition) {
            tail.splice(0, 0, head);
            head = snakePiece(nextPosition, input.goUnder());
            overlap(head, tail);
        }
        tail = tail.slice(0, maxLength);
        
        return direction;
    };
    
    obj.draw = function () {
        var i, firstPiece;
        renderer.drawCurve(tail);
        
        for (i = 2; i < tail.length; i++) {
            if (tail[i].goUnder === true) {
                firstPiece = i === 2 ? head : tail[i - 2];
                renderer.drawCurve([firstPiece, tail[i - 1], tail[i]]);
            }
        }
    };
    
    return obj;
};

//gathers keypresses and stores user instructions implied
userInput = function () {
    "use strict";
    var obj, direction, keyCode, goUnder;
    
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
        case 32:
            goUnder = true;
            break;
        }
    };
    
    obj.direction = function () {
        return direction;
    };
    
    obj.goUnder = function () {
        return goUnder;
    };
    
    obj.clearUnderness = function () {
        goUnder = false;
    };
                
    obj.setDirection = function (dir) {
        direction = dir;
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
    },
    
    addVectors: function (vector1, vector2) {
        if (vector1 && vector2) {
            return [vector1[0] + vector2[0], vector1[1] + vector2[1]];
        }
    },
    
    pointEquals: function (point1, point2) {
        return point1 && point2 &&
            point1[0] === point2[0] && point1[1] === point2[1];
    },
    
    vectorReverse: function (vector) {
        if (vector) {
            return [vector[0] * -1, vector[1] * -1];
        }
    }
};
    
directionGuider = function (area) {
    'use strict';
    var guider = {};
    guider.correctDirection = function (proposedDirection, currentPosition, previousPosition) {
        var i, nextMove, turnLeft, reversed, recorrected;
        turnLeft = function (vector) {
            return [vector[1], -1 * vector[0]];
        };
        
        //if we are trying to reverse on ourselves, propose going forward in the same direction as before
        reversed = Geometry.addVectors(previousPosition, Geometry.vectorReverse(currentPosition));
        if (reversed && Geometry.pointEquals(reversed, proposedDirection)) {
            proposedDirection = Geometry.vectorReverse(reversed);
        }

        //take the first legal move you can find, ie not reversed, not out of bounds
        if (currentPosition && proposedDirection) {
            for (i = 0; i < 4; i++) {
                nextMove = Geometry.addVectors(proposedDirection, currentPosition);
                
                if (!Geometry.pointEquals(proposedDirection, reversed)
                        && nextMove[0] >= 0 && nextMove[0] <= area.width
                        && nextMove[1] >= 0 && nextMove[1] <= area.height) {
                    return proposedDirection;
                }
                proposedDirection = turnLeft(proposedDirection);
            }
        }

        return proposedDirection;
    };
    return guider;
};
        
snakePiece = function (point, goUnder) {
    'use strict';
    var obj = {};
    obj.X = point[0];
    obj.Y = point[1];
    obj.point = point;
    obj.goUnder = goUnder;
    return obj;
};