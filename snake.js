/*(function () {
    "use strict";
    var NONE = [0, 0],
        LEFT = [-1, 0],
        DOWN = [0, 1],
        RIGHT = [1, 0],
        UP = [0, -1],
        drawingCanvas = document.getElementById('gameArea');
    if (drawingCanvas.getContext) {
        var drawingContext = drawingCanvas.getContext('2d'),
            gridSquare = function (context, grid, xPos, yPos) {
                this.x = xPos;
                this.y = yPos;
                this.top = yPos * 20;
                this.right = xPos * 20;
                
                this.head = function(neckDirection) {
                    this.isHead = true;
                    this.isSnake = true;
                    this.followingDirection = neckDirection;
                };
                
                this.body = function(precedingDirection, followingDirection) {
                    this.isSnake = true;
                    this.precedingDirection = precedingDirection;
                    this.followingDirection = followingDirection;
                };
                    
                this.food = function () {
                    this.color = '#999922';
                    this.isFood = true;
                };
                
                this.timeout = 2;
                
                this.draw = function () {
                    var color = '#fff';
                    if(this.isHead == true)
                    {
                        color = '#DA00CC';
    
                    }else if(this.isFood == true)
                    {
                        color = '#999922';
                    }
                    
                    context.beginPath();
                    context.rect(this.right, this.top, 20, 20);
                    var lingrad = context.createLinearGradient(0, 0, 300, 300);
                        lingrad.addColorStop(0, color);
                        lingrad.addColorStop(1, '#fff');
                    context.fillStyle = lingrad;
                    context.fill();
                    context.closePath();
                    if(this.precedingDirection && this.followingDirection)
                    {
                        context.lineWidth = 10;
                        context.strokeStyle = '#000';
                        context.beginPath();
                        var centre = [this.right + 10, this.top + 10];
                        
                        context.moveTo(centre[0] - 10 * this.precedingDirection[0], centre[1] - 10 * this.precedingDirection[1]);
                        context.bezierCurveTo(
                                       centre[0] - 5 * this.precedingDirection[0],
                                       centre[1] - 5 * this.precedingDirection[1],
                                       centre[0] + 5 * this.followingDirection[0],
                                       centre[1] + 5 * this.followingDirection[1],
                                       centre[0] + 10 * this.followingDirection[0],
                                       centre[1] + 10 * this.followingDirection[1]);
                        context.stroke();
                        context.lineWidth = 5;
                        context.strokeStyle = '#FFF';
                        context.beginPath();
                        var centre = [this.right + 10, this.top + 10];
                        
                        context.moveTo(centre[0] - 10 * this.precedingDirection[0], centre[1] - 10 * this.precedingDirection[1]);
                        context.bezierCurveTo(
                                       centre[0] - 5 * this.precedingDirection[0],
                                       centre[1] - 5 * this.precedingDirection[1],
                                       centre[0] + 5 * this.followingDirection[0],
                                       centre[1] + 5 * this.followingDirection[1],
                                       centre[0] + 10 * this.followingDirection[0],
                                       centre[1] + 10 * this.followingDirection[1]);
                        context.stroke();
                    }
                    this.clear();
                };
                
                this.clear = function() {
                    this.isFood = false;
                    this.isSnake = false;
                    this.isHead = false;
                    this.precedingDirection = undefined;
                    this.followingDirection - undefined;
                }
            },
            
            grid = function () {
                this.gridSize = 15;
                this.squares = [];
                
                //set up grid of squares
                for (var i=0; i<this.gridSize; i++)
                        {
                            var row = [];
                            for (var j=0; j<this.gridSize; j++)
                            {
                                var square = new gridSquare(drawingContext, this, i, j);
                                row.push(square);
                            }
                            this.squares.push(row);
                        }
                    
                this.draw = function()
                    {
                        for (var i=0; i<this.gridSize; i++)
                        {
                            for (var j=0; j<this.gridSize; j++)
                            {
                                this.squares[i][j].draw();
                            }
                        }
                    };
                
            var randomPosition  = function (grid) {
                return Math.floor(Math.random() * grid.gridSize);
                }
                
            this.randomSquarePosition = function () {
                return [randomPosition(this), randomPosition(this)];
                }
            };
            
        
        var snake = function(grid){
            this.head = [grid.randomSquarePosition(),null];
            this.dead = false;
            this.grid = grid;
            this.body = [];
            this.maxLength = 10;
            
            this.move = function(){
                if(!(this.direction)) 
                    return this;
                
                this.body.push(this.head);
                if(this.body.length >= this.maxLength)
                {
                    this.body = this.body.slice(1);
                }
                this.head = [this.nextSquare(this.head[0], this.direction),this.direction];
                if(this.collision(this.head[0], this.body) == true)
                    this.dead = true;
                return this;
            }
            
            this.draw = function(){
                this.grid.squares[this.head[0][0]][this.head[0][1]].head(this.direction);
                for(var i=0; i<this.body.length; i++){
                    var prevDirection = i > 0 ? this.body[i][1] : this.head[1];
                    var nextDirection;
                    if(i < this.body.length - 1){ nextDirection = this.body[i+1][1]};
                   this.grid.squares[this.body[i][0][0]][this.body[i][0][1]].body(prevDirection, nextDirection); 
                }
            };
            
            this.nextSquare = function(currentSquare, direction){
                var gridSize = this.grid.gridSize;
                var newX = (currentSquare[0] + direction[0] + gridSize) % gridSize;
                var newY = (currentSquare[1] + direction[1] + gridSize) % gridSize;
                return [newX,newY];
            };
            
            this.keyHandler = function(e)
            {
                e = e || window.event;
    
                var keyCode = e.keyCode;
                switch(keyCode)
                {
                    case 37: liveSnake.direction = LEFT; break;
                    case 38: liveSnake.direction = UP; break;
                    case 39: liveSnake.direction = RIGHT; break;
                    case 40: liveSnake.direction = DOWN; break;
                }   
            };
            
            this.collision = function(candidate, collider){
                //check that the canidate is a point [x,y]    
                if(!(this.isPoint(candidate)))
                {
                    console.log('invalid point in collision');
                    return false;
                }
                if(this.isPoint(collider))
                {
                    return this.collisionWithPoint(candidate, collider);
                }
                return this.collisionWithChain(candidate, collider);
            }
            
           this.collisionWithPoint = function(candidate, collider){
                return candidate[0] === collider[0] && candidate[1] === collider[1];
            }
                
            this.collisionWithChain = function(candidate, collider){
                for(var i = 0; i < collider.length; i++)
                {
                    if(candidate[0] == collider[i][0][0] && candidate[1] == collider[i][0][1]) return true;
                }
                return false;
            }
                    
            this.isPoint = function(point){
                    if(point.length != 2 || !(typeof(point[0]) === 'number' && typeof(point[1]) === 'number'))
                {
                    return false;
                }
                return true;
            }
                
            this.eat = function (food) {
                if(this.collision(food.position,this.head[0])){
                    this.maxLength = this.maxLength + 1;
                    food.respawn();
                }
            }
        }
        
        var food = function (snake, grid) {
            this.snake = snake;
            this.grid = grid;
            
            this.draw = function() {
                this.grid.squares[this.position[0]][this.position[1]].food();
            };            
                
            this.getNewPosition = function (grid) {
                var candidate = grid.randomSquarePosition();
                while (this.snake.collision(candidate, this.snake.head[0]) || this.snake.collision(candidate,this.snake.body))
                {
                          candidate = grid.randomSquarePosition();
                      };
                return candidate;
            }
            
            this.respawn = function() {
                this.position = this.getNewPosition(this.grid);
            }
            this.position = this.getNewPosition(this.grid);
        };
            
        var bigGrid = new grid();   
        
        var showPlayAgain = function() {
            document.getElementById('playAgain').setAttribute('style', '');
        }
            
        var playAgain = function() {
            document.getElementById('playAgain').setAttribute('style', 'visibility: hidden;');
            currentGame = new game();   
        },
            liveSnake,
            liveFood,
            game = function () {
                liveSnake = new snake(bigGrid); 
                liveFood = new food (liveSnake, bigGrid);
                var intervalId = setInterval(
                    function(){
                        if(liveSnake.dead == false){
                            liveSnake.move().draw();
                            liveSnake.eat(liveFood);
                            liveFood.draw();
                            bigGrid.draw()
                        } else {
                            showPlayAgain();
                            clearInterval(intervalId);
                        }
                              },300);
                    
                document.onkeydown = liveSnake.keyHandler;
            };
        //var currentGame = new game();
        document.getElementById('playAgainButton').onclick = playAgain;
        drawingContext.lineWidth = 4;
        
    } 
})();*/

(function () {
    "use strict";
    var showPlayAgain, playAgain, drawingCanvas, drawingContext, game, currentGame, doc, 
        snake, gameArea;
    
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
        gameArea = gameArea(drawingCanvas);
        snake = initializeSnake(drawingCanvas);
    };
    
    showPlayAgain();
    doc.getElementById('playAgainButton').onclick = playAgain;
}());



