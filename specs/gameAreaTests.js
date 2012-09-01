describe("Game Area: calculating initial dimensions", function () {
    "use strict";
    var gameArea, canvas;
    
    it("should assign a nonzero height when we have more than 50 pixels", function () {
       canvas = { height: 50, width: 50 }
       gameArea = initializeGameArea(canvas);
        expect(gameArea.height).toBeGreaterThan(0);
       });
    
    it("should return undefined if height is less than 50", function () {
       canvas = { height: 49, width: 50 }
       gameArea = initializeGameArea(canvas);
        expect(gameArea).toBeUndefined();
    });
    
    it("should return un if width is less than 50", function () {
       canvas = { height: 50, width: 49}
       gameArea = initializeGameArea(canvas);
        expect(gameArea).toBeUndefined();
    });
    
    it("should assign a square game area to a square canvas", function () {
       canvas = { height: 100, width: 100 }
       gameArea = initializeGameArea(canvas);
        expect(gameArea.height).toEqual(gameArea.width);
       });

    it("should assign a wide game area to a wide canvas", function () {
       canvas = { height: 100, width: 200 }
       gameArea = initializeGameArea(canvas);
        expect(gameArea.height).toBeLessThan(gameArea.width);
       });
    
    it("should be less than or equal to 30 squares high", function () {
        var computedHeight = function (height, width) {
            canvas = { height: height, width: width }
            return initializeGameArea(canvas).height;
        };

        expect(computedHeight(100,100)).toBeLessThan(31);
        expect(computedHeight(500,100)).toBeLessThan(31);
        expect(computedHeight(100,700)).toBeLessThan(31);
       });
    
    it("should be less than or equal to 30 squares wide", function () {
        var computedWidth = function (height, width) {
            canvas = { height: height, width: width }
            return initializeGameArea(canvas).width;
        };

        expect(computedWidth(100,100)).toBeLessThan(31);
        expect(computedWidth(800,100)).toBeLessThan(31);
        expect(computedWidth(100,700)).toBeLessThan(31);
       });
    
});

describe("Game Area: calculating initial dimensions",function () {
    "use strict"
    var gameArea, canvas;
    
    it("should assign a physical point to the origin [0, 0]", function () {
        var origin;
        canvas = { height: 100, width: 200 }
        gameArea = initializeGameArea(canvas);
        origin = gameArea.point(0,0);
        expect(origin).toBeTruthy();
        expect(origin[0]).toBeGreaterThan(-1);
        expect(origin[1]).toBeGreaterThan(-1);
    });
    
    it("should assign each point to be a different position", function () {
        var somePoints, isDifferentPoint, otherPoints, counter, innerCounter, thisPoint;
            
        isDifferentPoint = function (point, otherPoint) {
                return point[0] !== otherPoint[0] ||
                    point[1] !== otherPoint[1];
        }
                
        canvas = { height: 100, width: 200 };
        gameArea = initializeGameArea(canvas);
        somePoints = [gameArea.point(0,0), gameArea.point(4,5), gameArea.point(6,5), gameArea.point(0,7)];
        
           
       for(counter = 0; counter < somePoints.length; counter++) {
           thisPoint = somePoints[counter]
           for(innerCounter = 0; innerCounter < somePoints.length;innerCounter++ ){
                if(innerCounter === counter) {
                    continue;
                }
               expect(isDifferentPoint (thisPoint, somePoints[innerCounter])).toBeTruthy();
           }
       } 
    });
});