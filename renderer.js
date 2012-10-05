// given rendering commands by the game object, this draws them on the canvas 
// using the drawingContext
var initializeRenderer = function (canvas, gameArea) {
    "use strict";
    var renderer = {}, previousPoint, nextPoint, thisPoint, i, context,
        curveStart, curveEnd, drawSimpleCurve, drawSimpleCurve2, drawSegment, drawBoundedPiece, outerBandWidth, innerBandWidth;
    context = canvas.getContext('2d');
    outerBandWidth = Math.floor(gameArea.gridSquareSize() * 0.8);
    innerBandWidth = Math.floor(gameArea.gridSquareSize() * 0.6);
    
    drawSimpleCurve = function (pointArray, lineWidth, strokeStyle, startCondition, endCondition) {
        context.lineWidth = lineWidth;
        context.strokeStyle = strokeStyle;
        context.beginPath();
        previousPoint = gameArea.point(pointArray[0].X, pointArray[0].Y);
        
        for (i = 0; i < pointArray.length - 1; i++) {
            thisPoint = gameArea.point(pointArray[i].X, pointArray[i].Y);
            nextPoint = gameArea.point(pointArray[i + 1].X, pointArray[i + 1].Y);
            curveStart = Geometry.midpoint(previousPoint, thisPoint);
            curveEnd = Geometry.midpoint(thisPoint, nextPoint);
            context.moveTo(curveStart[0], curveStart[1]);
            context.quadraticCurveTo(thisPoint[0], thisPoint[1], curveEnd[0], curveEnd[1]);
            previousPoint = thisPoint;
        }
        
        context.stroke();
    };
    
    drawSegment = function (position, priorDirection, postDirection, colour) {
        var start, mid, end, distanceToEdge;
        distanceToEdge = gameArea.gridSquareSize() / 2;
        mid = gameArea.point(position.X, position.Y);
        start = [mid[0] - distanceToEdge * priorDirection[0], mid[1] - distanceToEdge * priorDirection[1]];
        end = [mid[0] + distanceToEdge * postDirection[0], mid[1] + distanceToEdge * postDirection[1]];
        drawBoundedPiece(start, mid, end, colour);
    };
    
    renderer.drawCurve = function (pointArray, startCondition, endCondition) {
        if (pointArray.length < 3) {
            return;
        }
        
        drawSimpleCurve(pointArray, outerBandWidth, '#000', startCondition, endCondition);
        drawSimpleCurve(pointArray, innerBandWidth, '#FFF', startCondition, endCondition);
    };
    
    drawSimpleCurve2 = function (start, mid, end, lineWidth, strokeStyle) {
        context.lineWidth = lineWidth;
        context.strokeStyle = strokeStyle;
        context.beginPath();
        context.moveTo(start[0], start[1]);
        context.quadraticCurveTo(mid[0], mid[1], end[0], end[1]);
        context.stroke();
    };
    
    drawBoundedPiece = function (start, mid, end, colour) {
        drawSimpleCurve2(start, mid, end, outerBandWidth, '#000');
        drawSimpleCurve2(start, mid, end, innerBandWidth, colour);
    };
    
    renderer.drawHead = function (position, priorDirection, postDirection) {
        return drawSegment(position, priorDirection, postDirection, '#dfd');
    };
    
    renderer.drawBodySegment = function (bodyPiece) {
        return drawSegment(bodyPiece, bodyPiece.priorDirection, (bodyPiece.postDirection || bodyPiece.priorDirection), '#fff');
    };
    
    renderer.clear = function () {
        context.beginPath();
        context.rect(0, 0, 600, 600);
        context.fillStyle = '#eef';
        context.fill();
        context.closePath();
    };
        
    return renderer;
};