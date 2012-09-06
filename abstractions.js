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
initializeRenderer = function (canvas, gameArea) {
    "use strict";
    var renderer = {}, previousPoint, nextPoint, thisPoint, i, context, curveStart, curveEnd;
    context = canvas.getContext('2d');
    renderer.drawCurve = function (pointArray, startCondition, endCondition) {
        context.lineWidth = 2;
        context.strokeStyle = '#000';
        context.beginPath();
        context.moveTo(pointArray[0][0], pointArray[0][1]);
        for (i = 0; i < pointArray.length - 1; i++) {
            if (previousPoint) {
                thisPoint = gameArea.point(pointArray[i][0], pointArray[i][1]);
                nextPoint = gameArea.point(pointArray[i + 1][0], pointArray[i + 1][1]);

                curveStart = Geometry.midpoint(previousPoint, thisPoint);
                curveEnd = Geometry.midpoint(thisPoint, nextPoint);
                context.moveTo(curveStart[0], curveStart[1]);
                context.quadraticCurveTo(thisPoint[0], thisPoint[1], curveEnd[0], curveEnd[1]);
                
            }
            if (thisPoint) {
                previousPoint = [thisPoint[0], thisPoint[1]];
            } else {
                previousPoint = gameArea.point(pointArray[i][0], pointArray[i][1])
            }
        }
        context.stroke();
        
    };
    
    renderer.clear = function () {
        context.beginPath();
        context.rect(0, 0, 600, 600);
        context.fillStyle = '#fff';
        context.fill();
        context.closePath();
    };
        
    return renderer;
};
    
snake = function (renderer, gameArea) {
    "use strict";
    var head, tail, obj, nextSquare, maxLength;
    head = gameArea.randomPoint();
    tail = [];
    maxLength = 20;
    
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
}