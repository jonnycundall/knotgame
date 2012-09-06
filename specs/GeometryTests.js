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