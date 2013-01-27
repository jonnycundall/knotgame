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
                     snakePiece([2,0], false, UP, UP, 0),
                     snakePiece([3,0], false, UP, UP, 0)];
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
                     snakePiece([3,1], false, UP, UP, 0),
                     snakePiece([4,1], false, UP, UP, 0)];
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
                     snakePiece([3,1], false, UP, UP, 0),
                     snakePiece([4,1], false, UP, UP, 0)];
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
                     snakePiece([3,1], false, UP, UP, 0),
                     snakePiece([4,1], false, UP, UP, 0)];
        expect(knotComparer(snake1, snake2)).toBeTruthy();
    }  
      );
             
             it("should get this bigger knot right", function(){
                 var snkae1 = [snakePiece([6,3], false, LEFT, LEFT),
                               snakePiece([7,3], false, UP, LEFT),
                               snakePiece([7,4], false, UP, UP),
                               snakePiece([7,5], false, RIGHT, UP),
                               snakePiece([6,5], false, RIGHT, RIGHT),
                               snakePiece([5,5], false, DOWN, RIGHT),
                               snakePiece([5,4], false, DOWN, DOWN)];
                 
                 var snake2 = [snakePiece([3,8], false, UP, UP),
                               snakePiece([3,9], false, LEFT, UP),
                               snakePiece([4,9], false, LEFT, LEFT),
                               snakePiece([5,9], false, DOWN, LEFT),
                               snakePiece([5,8], false, DOWN, DOWN),
                               snakePiece([5,7], false, RIGHT, DOWN),
                               snakePiece([4,7], false, RIGHT, RIGHT),
                               snakePiece([3,7], false, UP, RIGHT)];
             }
               );
});