// given rendering commands by the game object, this draws them on the canvas 
// using the drawingContext
initializeRenderer = function (canvas, gameArea) {
    "use strict";
    var renderer = {}, previousPoint, nextPoint, thisPoint, i, context, curveStart, curveEnd;
    context = canvas.getContext('2d');
    renderer.drawCurve = function (pointArray, startCondition, endCondition) {
        if (pointArray.length < 3) {
            return;
        }
        context.lineWidth = 2;
        context.strokeStyle = '#000';
        context.beginPath();
        previousPoint = gameArea.point(pointArray[0][0], pointArray[0][1]);
        //context.moveTo(previousPoint[0], previousPoint[1]);
        for (i = 1; i < pointArray.length - 1; (i++)) {
            thisPoint = gameArea.point(pointArray[i][0], pointArray[i][1]);
            nextPoint = gameArea.point(pointArray[i + 1][0], pointArray[i + 1][1]);

            curveStart = Geometry.midpoint(previousPoint, thisPoint);
            curveEnd = Geometry.midpoint(thisPoint, nextPoint);
            context.moveTo(curveStart[0], curveStart[1]);
            context.quadraticCurveTo(thisPoint[0], thisPoint[1], curveEnd[0], curveEnd[1]);
            previousPoint = thisPoint;
        }
        context.stroke();
        
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