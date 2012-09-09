
describe("tests that directionGuider prevents snake from leaving the game area", function () {
    'use strict';
    
    it("should convert up to left on top edge", function () {
        var area = { height: 10, width: 10 }, 
            guider = directionGuider(area),
            newDirection = guider.correctDirection([0, -1], [4, 0]);
        expect(newDirection[0]).toEqual(-1);
        expect(newDirection[1]).toEqual(0);
    });
    
    it("should convert left to down on left edge", function () {
        var area = { height: 10, width: 10 }, 
            guider = directionGuider(area),
            newDirection = guider.correctDirection([-1, 0], [0, 6]);
        expect(newDirection[0]).toEqual(0);
        expect(newDirection[1]).toEqual(1);
    });
    
    it("should convert down to right on bottom edge", function () {
        var area = { height: 10, width: 10 }, 
            guider = directionGuider(area),
            newDirection = guider.correctDirection([0, 1], [3, 10]);
        expect(newDirection[0]).toEqual(1);
        expect(newDirection[1]).toEqual(0);
    });
    
    it("should convert right to up on right edge", function () {
        var area = { height: 10, width: 10 }, 
            guider = directionGuider(area),
            newDirection = guider.correctDirection([1, 0], [10, 7]);
        expect(newDirection[0]).toEqual(0);
        expect(newDirection[1]).toEqual(-1);
    });
    
    it("should convert right to left on top right corner", function () {
        var area = { height: 10, width: 10 }, 
            guider = directionGuider(area),
            newDirection = guider.correctDirection([1, 0], [10, 0]);
        expect(newDirection[0]).toEqual(-1);
        expect(newDirection[1]).toEqual(0);
    });
    
    it("should leave direction alone if we're not on the edge", function () {
        var area = { height: 10, width: 10 }, 
            guider = directionGuider(area),
            newDirection = guider.correctDirection([1, 0], [4, 7]);
        expect(newDirection[0]).toEqual(1);
        expect(newDirection[1]).toEqual(0);
    });
});

describe('directionGuider: exceptional cases', function () {
    it('should not blow up if there is no position', function () {
        var area = { height: 10, width: 10 }, 
            guider = directionGuider(area),
            newDirection = guider.correctDirection([1, 0], undefined);
        expect(newDirection[0]).toEqual(1);
        expect(newDirection[1]).toEqual(0);
    });
    
    it('should not blow up if there is no direciton', function () {
        var area = { height: 10, width: 10 }, 
            guider = directionGuider(area),
            newDirection = guider.correctDirection(undefined, [4,5]);
    });
});