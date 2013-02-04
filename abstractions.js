var gameArea, initializeRenderer, snake, userInput, directionGuider,
    snakePiece, stateMachine, gameInterface, snakeComparer, levels, snakeDrawer, knotRunner, knotComparer
    NONE = [0, 0],
    LEFT = [-1, 0],
    DOWN = [0, 1],
    RIGHT = [1, 0],
    UP = [0, -1],
    STATE_DEAD = 0,
    STATE_ALIVE = 1,
    STATE_CHECK_SUCCESS = 2,
    STATE_SUCCESS = 3,
    STATE_FAILURE = 4;

gameInterface = function (snake, levels) {
        var face = {}, newDirection, currentLevel, runner;
        currentLevel = 1;
        runner = knotRunner();
        face.move = function (input) {
            newDirection = snake.move(input);
            input.setDirection(newDirection);
            if (snake.dead === true) {
                return STATE_DEAD;
            }
            if (snake.isClosed() === true) { 
                return STATE_CHECK_SUCCESS;
            }
            return STATE_ALIVE;
        };
            
        face.start = function (input) {
            snake.reset();
            return STATE_ALIVE;
        };
            
        face.checkSuccess = function (input) {
            var candidate, master, comparer;
            candidate = snake.snake();
            master = levels[currentLevel];
            console.log(knotRunner(master));
            console.log(knotRunner(candidate));
            
            if(knotComparer(master, candidate) === true)
            {
                currentLevel = currentLevel + 1;
                return STATE_SUCCESS;
            }
            //console.log(snake.testVersion());
            //console.log(master);
            return STATE_FAILURE;
        };
    
        face.showSuccess = function () {
            console.log('success');
            snake.reset();
            return STATE_ALIVE;
        };
    
        face.showFailure = function () {
            console.log('failure');
            return STATE_ALIVE;
        };
    
        face.currentLevel = function () { return currentLevel; }
    
        return face;
    }

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
            return (point[0] >= 0 && point[0] <= width && point[1] >= 0 && point[1] <= height);
        },
        gridSquareSize: function () {
            return gridSquareSize;
        }
    };
    
    return area;
};
    
snake = function (renderer, gameArea, startPoint) {
    "use strict";
    var head, tail, tailTip, obj, nextSquare, maxLength, guider, 
        overlap, priorDirection, index, compareForRenderOrder, isClosed, drawer;
    head = snakePiece(startPoint, false);
    tail = [];
    maxLength = 30;
    guider = directionGuider(gameArea);
    index = 0;
    drawer = snakeDrawer(renderer);
    
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
        if (aHead.goUnder === true) {
            return;
        }
        for (i = 0; i < tail.length; i++) {
            if (Geometry.pointEquals(aTail[i].point, aHead.point) === true) {
                tail[i].goUnder = true;
            }
        }
    };
    
    isClosed = function (body) {
        return body && body.length > 3 &&
            Geometry.pointEquals(body[0].point, body[body.length - 1].point)
            && Geometry.pointEquals(body[0].postDirection, body[body.length - 1].priorDirection);
    };
    
    compareForRenderOrder = function (a, b) {
        if (a.goUnder && !b.goUnder) {
            return -1;
        }
        if (!a.goUnder && b.goUnder) {
            return 1;
        }
        return a.index < b.index ? -1 : 1;
    };
    
    obj = {};
    
    obj.move = function (input) {
        var nextPosition, lastPosition, direction, exp;
        direction = input.direction();
        if (tail[1]) {
            direction = guider.correctDirection(direction, head.point, tail[1].point);
        }
        nextPosition = nextSquare(direction);
        if (nextPosition) {
            index++;
            head = snakePiece(nextPosition, input.goUnder(), direction, direction, index);
            
            if (tail[0]) {
                tail[0].postDirection = direction;
            }
            overlap(head, tail);
            tail.splice(0, 0, head);
        }
        
        // restart snkae when we run out of rope - otherwise it's hard to join up
        if (tail.length >= maxLength) {
            tail = [head];
        }
        
        priorDirection = direction;
        return direction;
    };
    
    obj.draw = function () {
        if(tail && this.isClosed(tail))
        {
            return drawer.drawClosed(tail);
        }
        return drawer.drawOpen(tail);
    };
    
    obj.snake = function () {
        return tail;
    };
    
    obj.isClosed = function () { return isClosed([head].concat(tail)) }
    
    obj.reset = function () { 
    	tail = [];
    };
    
    //output a string representation of itself so I can use it in a test
    //snakePiece([1,0], false, UP, UP, 0),
    obj.testVersion = function (){
        "use strict";
        var directionConvert = function (directionVector) {
            if(directionVector[0] === 0 && directionVector[1] === -1) return 'UP';
            if(directionVector[0] === 0 && directionVector[1] === 1) return 'DOWN';
            if(directionVector[0] === -1 && directionVector[1] === 0) return 'LEFT';
            if(directionVector[0] === 1 && directionVector[1] === 0) return 'RIGHT';
        };
        
        return tail
                .map(function(piece){
                    return 'snakePiece([' + piece.X + ',' + piece.Y +'], '+ piece.goUnder + ', ' + directionConvert(piece.priorDirection) + ', ' + directionConvert(piece.postDirection) + '),';})
                .join('');
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
    },
    
    difference: function (point1, point2) {
        return [point2[0] - point1[0], point2[1] - point1[1]];
    },
        
    topleftest: function (arrayOfPoints) {
        var sortfunction = function (a, b) {
            if(a[0] === b[0] && a[1] === b[1])
                {return 0; }
            if(a[0] + a[1] < b[0] + b[1]) 
                {return -1}
            if(a[0] + a[1] === b[0] + b[1])
            {
                if(a[0] < b[0])
                    return -1;
                return 1;
            }
            return 1;
        };
        return arrayOfPoints.sort(sortfunction)[0]; 
    },
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
        
snakePiece = function (point, goUnder, priorDirection, postDirection, index) {
    'use strict';
    var obj = {};
    obj.X = point[0];
    obj.Y = point[1];
    obj.priorDirection = priorDirection;
    obj.postDirection = postDirection;
    obj.point = point;
    obj.index = index;
    obj.goUnder = goUnder;
    return obj;
};
        
stateMachine = function (gameInterface) {
    'use strict';
    var levelNumber, mode, obj, action; 
    mode = 'go';
    action = gameInterface.start;
    obj = {};
    obj.levelNumber = function () {return levelNumber; };
    obj.levelUp = function () {levelNumber = levelNumber + 1; };
    obj.freeze = function () {mode = 'freeze'; };
    obj.start = function () {mode = 'go'; };
    obj.do = function (input) {
        var result = action(input);
        switch (result) {
            case STATE_ALIVE:
                action = gameInterface.move;
                break;
            case STATE_DEAD:
                action = gameInterface.start;
                break;
            case STATE_CHECK_SUCCESS:
                action = gameInterface.checkSuccess;
                break;
            case STATE_SUCCESS:
                action = gameInterface.showSuccess;
                break;
            case STATE_FAILURE:
                action = gameInterface.showFailure;
                break;
            default:
                console.log('unexpected state');
        }
    }
    return obj;
};
        
knotComparer = function (snake1, snake2) {
   var goal, candidate, i, forwardGoal, reverseGoal;
   goal = knotRunner(snake1);
   forwardGoal = goal.join('');
   reverseGoal = goal.reverse().join('').replace(/r/g,'X').replace(/l/g,'r').replace(/X/g,'l');
   candidate = knotRunner(snake2);
   
   if(goal.length + candidate.length === 0) //typically both empty arrays
      return true;
   
   for(i = 0; i < candidate.length; i++){
      candidate = candidate.splice(1).concat(candidate);
      if(candidate.join('') === forwardGoal || candidate.join('') === reverseGoal)
      	return true;
      
   }
   return false;
};

levels = function (renderer, gameArea) {
    "use strict";
    var drawer, levelList, returnObj, makeMovement;
    makeMovement = function(actions) {
        var cord, input, actions;
        cord = snake(renderer, gameArea, [2,2]); 
        input = userInput();
        actions.map(function (a) { 
            input.setDirection(a[0]);
            if(a.length > 1)
            {
                input.goUnder();
            }else{
                input.clearUnderness();
            }
            cord.move(input);
        });
        
        return cord.snake(); 
    }
    drawer = snakeDrawer(renderer);
    levelList = 
    {
    //level 1: just the unknot
        
    1: makeMovement([[RIGHT],[RIGHT],[DOWN],[DOWN],[LEFT],[LEFT],[UP],[UP], [RIGHT]])   ,
            
    //level 2: the simplest trefoil
    2: makeMovement([[RIGHT, true], [RIGHT], [DOWN], 
                     [LEFT], [LEFT], [UP, true], [UP], [RIGHT], 
                     [DOWN, true], [DOWN, true], [DOWN, true],[LEFT],[LEFT], [UP],[UP], [RIGHT], [RIGHT]])
    };
    
    return {
        1: levelList[1],
        2: levelList[2],
        drawGoal: function (levelNumber) {
            drawer.drawClosed(levelList[levelNumber]);
    }
    };
    
}
    
snakeDrawer = function (renderer) {
    var compareForRenderOrder = function (a, b) {
        if (a.goUnder && !b.goUnder) {
            return -1;
        }
        if (!a.goUnder && b.goUnder) {
            return 1;
        }
        return a.index < b.index ? -1 : 1;
    };
    var obj = {};
    
    obj.drawOpen = function (tail) {
        var i, drawOrder;

        drawOrder = Array.prototype.slice.call(tail).sort(compareForRenderOrder);
        for (i = 0; i < drawOrder.length; i++) {
            renderer.drawBodySegment(drawOrder[i]);
        }
    };
    
    obj.drawClosed = function (tail) {
        //for now, we're just missing the end off so we don't show an ugly overlap
        var i, drawOrder;

        drawOrder = Array.prototype.slice.call(tail).sort(compareForRenderOrder);
        for (i = 0; i < drawOrder.length -1; i++) {
            renderer.drawBodySegment(drawOrder[i]);
        }
    };
    
    return obj;
}

knotRunner = function (arrayOfSnakePieces){
   var obj, convertToTurn, piece, turn, i, j, piece, comparePiece, simplifiedSnake = [],
   RIGHTTURN = 'r', 
   LEFTTURN = 'l',
   OVER = 'o',
   UNDER = 'u';
   
   convertToTurn = function(prev, post) {
       if(!(prev && post)) return null;
   
       switch(prev){
           case(UP):
              if(post === LEFT) return LEFTTURN;
              if(post === RIGHT) return RIGHTTURN;
              break;
           case(DOWN):
              if(post === RIGHT) return LEFTTURN;
              if(post === LEFT) return RIGHTTURN;
              break;
           case(LEFT):
              if(post === DOWN) return LEFTTURN;
              if(post === UP) return RIGHTTURN;
              break;
           case(RIGHT):
              if(post === UP) return LEFTTURN;
              if(post === DOWN) return RIGHTTURN;
              break;
       }
       
       //if no match, return null, it's not a turn
       return null;
   };
   
   if(!arrayOfSnakePieces) return [];
   
   for (i=0; i< arrayOfSnakePieces.length - 1; i++){//we don't count the last piece as it's an overlap
       piece = arrayOfSnakePieces[i];
       turn = convertToTurn(piece.priorDirection, piece.postDirection);
       if(turn !== null) simplifiedSnake.push(turn);
       for(j = 0; j < arrayOfSnakePieces.length - 1; j++){
       	   if(i !== j){
              comparePiece = arrayOfSnakePieces[j];
              if(Geometry.pointEquals(piece.point, comparePiece.point)){
                 //check if the point is over or under
                 if(piece.goUnder === true && comparePiece.goUnder === false){
                 	simplifiedSnake.push(UNDER);}
                 if(piece.goUnder === comparePiece.goUnder && i < j){
                    simplifiedSnake.push(UNDER);}
                 if(piece.goUnder === comparePiece.goUnder && i > j){
                    simplifiedSnake.push(OVER);}
                 if(piece.goUnder === false && comparePiece.goUnder === true){
                    simplifiedSnake.push(OVER);}
              }
           }
       }
   }
   return simplifiedSnake;
  
}