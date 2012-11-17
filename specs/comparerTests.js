describe('Comparer - picking a "root" piece for a snake - so we can translate the whole snake to match another',
         function () {
    "use strict";
    it("should detect two identical snakes as equal", function () {
        var snake1 = [snakePiece([1,2], false, UP, UP, 0),
                      snakePiece([1,1], false, UP, UP, 0),
                      snakePiece([1,0], false, UP, UP, 0),
                     snakePiece([2,0], false, UP, UP, 0)];
        var snake2 = [snakePiece([1,2], false, UP, UP, 0),
                      snakePiece([1,1], false, UP, UP, 0),
                      snakePiece([1,0], false, UP, UP, 0),
                     snakePiece([2,0], false, UP, UP, 0)];
        expect(knotComparer(snake1, snake2)).toBeTruthy();
    }  
      );
             
    it("should detect two snakes translated by a constant vector as equal", function () {
        var snake1 = [snakePiece([1,2], false, UP, UP, 0),
                      snakePiece([1,1], false, UP, UP, 0),
                      snakePiece([1,0], false, UP, UP, 0),
                     snakePiece([2,0], false, UP, UP, 0)];
        var snake2 = [snakePiece([2,3], false, UP, UP, 0),
                      snakePiece([2,2], false, UP, UP, 0),
                      snakePiece([2,1], false, UP, UP, 0),
                     snakePiece([3,1], false, UP, UP, 0)];
        expect(knotComparer(snake1, snake2)).toBeTruthy();
    }  
      );
             
   it("should detect differences in underness", function () {
        var snake1 = [snakePiece([1,2], false, UP, UP, 0),
                      snakePiece([1,1], false, UP, UP, 0),
                      snakePiece([1,0], false, UP, UP, 0),
                     snakePiece([2,0], false, UP, UP, 0)];
        var snake2 = [snakePiece([2,3], false, UP, UP, 0),
                      snakePiece([2,2], true, UP, UP, 0),
                      snakePiece([2,1], false, UP, UP, 0),
                     snakePiece([3,1], false, UP, UP, 0)];
        expect(knotComparer(snake1, snake2)).toBeFalsy();
    }  
      );
             
    it("should detect knots starting at differen point but covering the same ground as the same", function () {
        var snake1 = [snakePiece([1,0], false, UP, UP, 0),
                      snakePiece([2,0], false, UP, UP, 0),
                      snakePiece([1,2], false, UP, UP, 0),
                      snakePiece([1,1], true, UP, UP, 0)];
        var snake2 = [snakePiece([2,3], false, UP, UP, 0),
                      snakePiece([2,2], true, UP, UP, 0),
                      snakePiece([2,1], false, UP, UP, 0),
                     snakePiece([3,1], false, UP, UP, 0)];
        expect(knotComparer(snake1, snake2)).toBeTruthy();
    }  
      );
});