describe("Game Area: calculating initial dimensions", function () {
    "use strict";
    var area, canvas;
    
    it("should assign a nonzero height when we have more than 50 pixels", function () {
        canvas = { height: 50, width: 50 };
        area = gameArea(canvas);
        expect(area.height).toBeGreaterThan(0);
       });
    
    it("should return undefined if height is less than 50", function () {
       canvas = { height: 49, width: 50 };
       area = gameArea(canvas);
        expect(area).toBeUndefined();
    });
    
    it("should return undefined if width is less than 50", function () {
       canvas = { height: 50, width: 49};
       area = gameArea(canvas);
        expect(area).toBeUndefined();
    });
    
    it("should assign a square game area to a square canvas", function () {
       canvas = { height: 100, width: 100};
       area = gameArea(canvas);
        expect(area.height).toEqual(area.width);
       });

    it("should assign a wide game area to a wide canvas", function () {
       canvas = { height: 100, width: 200 };
       area = gameArea(canvas);
        expect(area.height).toBeLessThan(area.width);
       });
    
    it("should be less than or equal to 30 squares high", function () {
        var computedHeight = function (height, width) {
            canvas = { height: height, width: width };
            return gameArea(canvas).height;
        };

        expect(computedHeight(100,100)).toBeLessThan(31);
        expect(computedHeight(500,100)).toBeLessThan(31);
        expect(computedHeight(100,700)).toBeLessThan(31);
       });
    
    it("should be less than or equal to 30 squares wide", function () {
        var computedWidth = function (height, width) {
            canvas = { height: height, width: width };
            return gameArea(canvas).width;
        };

        expect(computedWidth(100,100)).toBeLessThan(31);
        expect(computedWidth(800,100)).toBeLessThan(31);
        expect(computedWidth(100,700)).toBeLessThan(31);
       });
    
});

describe("Game Area: calculating initial dimensions",function () {
    "use strict"
    var area, canvas;
    
    it("should assign a physical point to the origin [0, 0]", function () {
        var origin;
        canvas = { height: 100, width: 200 }
        area = gameArea(canvas);
        origin = area.point(0,0);
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
        area = gameArea(canvas);
        somePoints = [area.point(0,0), area.point(4,5), area.point(6,5), area.point(0,7)];
           
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
    
    it("should generate a random point", function() {
        var point;
        area = gameArea({ height: 100, width: 100 });
        point = area.randomPoint();
        expect(point[0] && point[0] <= area.width).toBeTruthy();
        expect(point[1] && point[1] <= area.height).toBeTruthy();
    });
});