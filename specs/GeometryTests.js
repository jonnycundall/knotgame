describe("Geometry: calculating midpoint", function () {
    it("should return same point if they are both the same", function () {
        var point1, point2;
        point1 = point2 = [40, 70];
        expect(Geometry.midpoint(point1, point2)[0]).toEqual(point1[0]);
        expect(Geometry.midpoint(point1, point2)[1]).toEqual(point1[1]);
    });
    
    it("should calculate midpoint of two different points", function () {
        var point1, point2;
        point1 = [30, 30];
        point2 = [50, 50];
        expect(Geometry.midpoint(point1, point2)[0]).toEqual(40);
        expect(Geometry.midpoint(point1, point2)[1]).toEqual(40);
    });
});

describe("Geometry: determining collinearity", function () {
    it("should show these 3 points as collinear", function () {
        var point1, point2, point3;
        point1 = [50, 50];
        point2 = [40, 60];
        point3 = [30, 70];
        expect(Geometry.isCollinear(point1, point2, point3)).toBeTruthy();
    });
});

describe("Geometry: pciking the topleftest piece for snake comparison", function () {
    it("should pick out the top leftest piece", function () {
        expect(Geometry.topleftest([[0,0],[1,2]])).toEqual([0,0]);
        expect(Geometry.topleftest([[3,4],[1,7]])).toEqual([3,4]);
        expect(Geometry.topleftest([[3,4],[0,7]])).toEqual([0,7]);
        expect(Geometry.topleftest([[3,4],[0,7], [2,2], [1,3], [9,9], [2,5]])).toEqual([1,3]);
       }); 
    });