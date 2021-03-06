(function () {
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
                this.color = '#FFFFFF';
                
                this.activate = function () {
                    this.color = '#DA00CC';
                };
                
                this.timeout = 2;
            
                
                this.draw = function () {
                    context.beginPath();
                    context.rect(this.right, this.top, 20, 20);
                    context.fillStyle = this.color;
                    context.fill();
                    context.closePath();
                    this.color = '#FFFFFF';
                };
            },
            
            grid = function () {
                this.gridSize = 30;
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
            };
            
        
        var snake = function(start, grid){
            this.head = start;
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
                this.head = this.nextSquare(this.head, this.direction);
                if(this.collision(this.head,this.body) == true)
                    this.dead = true;
                return this;
            }
             
            this.draw = function(){
                this.grid.squares[this.head[0]][this.head[1]].activate();
                for(var i=0; i<this.body.length; i++){
                   this.grid.squares[this.body[i][0]][this.body[i][1]].activate(); 
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
            
            this.collision = function(head, body){
                for(var i = 0; i < body.length; i++)
                {
                    if(head[0] == body[i][0] && head[1] == body[i][1]) return true;
                }
                return false;
            };
        }
        
        var bigGrid = new grid();   
        
        var showPlayAgain = function() {
            document.getElementById('playAgain').setAttribute('style', '');
        }
            
        var playAgain = function() {
            document.getElementById('playAgain').setAttribute('style', 'visibility: hidden;');
            currentGame = new game();   
        },
            liveSnake,
            game = function () {
                liveSnake = new snake([4,5],bigGrid);   
                var intervalId = setInterval(
                    function(){
                        if(liveSnake.dead == false){
                        liveSnake.move().draw();
                        bigGrid.draw()
                        } else {
                            showPlayAgain();
                            clearInterval(intervalId);
                        }
                              },300);
                    
                document.onkeydown = liveSnake.keyHandler;
            };
        var currentGame = new game();
        document.getElementById('playAgainButton').onclick = playAgain;
    } 
})();