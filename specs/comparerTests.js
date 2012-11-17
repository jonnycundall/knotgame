describe('Comparer - picking a "root" piece for a snake - so we can translate the whole snake to match another',
         function () {
    "use strict";
    it("should detect two identical snakes as equal", function () {
        var snake1 = [[1,2],[1,1],[1,0],[2,0]];
        var snake2 = [[1,2],[1,1],[1,0],[2,0]];
        expect(knotComparer(snake1, snake2)).toBeTruthy();
    }  
      );
             
    it("should detect two snakes translated by a constant vector as equal", function () {
        var snake1 = [[1,2],[1,1],[1,0],[2,0]];
        var snake2 = [[2,3],[2,2],[2,1],[3,1]];
        expect(knotComparer(snake1, snake2)).toBeTruthy();
    }  
      );
});