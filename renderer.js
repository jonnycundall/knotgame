// given rendering commands by the game object, this draws them on the canvas 
// using the drawingContext
var initializeRenderer = function (canvas, gameArea) {
    "use strict";
    var renderer = {}, previousPoint, nextPoint, thisPoint, i, context, 
        curveStart, curveEnd, drawSimpleCurve, outerBandWidth, innerBandWidth;
    context = canvas.getContext('2d');
    outerBandWidth = Math.floor(gameArea.gridSquareSize() * 0.8);
    innerBandWidth = Math.floor(gameArea.gridSquareSize() * 0.6);
    
    drawSimpleCurve = function (pointArray, lineWidth, strokeStyle, startCondition, endCondition) {
        context.lineWidth = lineWidth;
        context.strokeStyle = strokeStyle;
        context.beginPath();
        previousPoint = gameArea.point(pointArray[0].X, pointArray[0].Y);
        
        for (i = 1; i < pointArray.length - 1; i++) {
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
    
    renderer.drawCurve = function (pointArray, startCondition, endCondition) {
        if (pointArray.length < 3) {
            return;
        }
        
        drawSimpleCurve(pointArray, outerBandWidth, '#000', startCondition, endCondition);
        drawSimpleCurve(pointArray, innerBandWidth, '#FFF', startCondition, endCondition);
    };
    
    renderer.clear = function () {
        context.beginPath();
        context.rect(0, 0, 600, 600);
        context.fillStyle = '#fff';
        context.fill();
        context.closePath();
    };
        
    return renderer;
};