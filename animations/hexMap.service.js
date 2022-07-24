(function () {
	'use strict';
	angular
		.module('animations')
		.factory('hexMap', hexMap);

	hexMap.$inject = ['genColors', 'audioService'];

	function hexMap(genColors, audioService) {

		var service = {
			draw: draw,
			drawHexagon: drawHexagon
		};
		var size = 30;
		var minSize = 0;
		var dbImpact = 0.02;
		var distance = 10;
		var stretch = 500;
		var fill = '#FF0000';
		var fillOpacity = 700;
		var border = 'rgba(255,255,255,0.5)';
		var borderWidth = 1;
		var showText = false;
		var textColor = '#FFFFFF';
		var hexagonAngle = 0.523598776;
		var hexHeight,hexRadius,hexRectangleHeight,	hexRectangleWidth;
		var hexHeightMAIN,hexRadiusMAIN,hexRectangleHeightMAIN,	hexRectangleWidthMAIN;

		return service;

		//////////////////////////////////////////////////

		function drawHexagon( ctx, xPos, yPos, xIndex, yIndex, d, sideLength, fill) {
			hexHeight = Math.sin(hexagonAngle) * sideLength;
			hexRadius = Math.cos(hexagonAngle) * sideLength;
			hexRectangleHeight = sideLength + 2 * hexHeight;
			hexRectangleWidth = 2 * hexRadius;

			if (sideLength > minSize) {
				var centerY = hexRectangleHeight/2;
				var centerX = hexRectangleWidth/2;
				ctx.beginPath();
				ctx.moveTo(xPos + hexRadius - centerX, yPos - centerY);
				ctx.lineTo(xPos + hexRectangleWidth - centerX, yPos + hexHeight - centerY);
				ctx.lineTo(xPos + hexRectangleWidth - centerX, yPos + hexHeight + sideLength - centerY);
				ctx.lineTo(xPos + hexRadius - centerX, yPos + hexRectangleHeight - centerY);
				ctx.lineTo(xPos - centerX, yPos + sideLength + hexHeight - centerY);
				ctx.lineTo(xPos - centerX, yPos + hexHeight - centerY);
				if(fill) {
					ctx.fillStyle=fill;
					ctx.fill();
				}
				ctx.closePath();
				ctx.stroke();
			}
			if (showText) {
				ctx.font = '12px Georgia';
				ctx.fillStyle = textColor;
				ctx.fillText(xIndex + ":" + yIndex,xPos-14,yPos+3);
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var db = audioService.getAverageDB();
			var sideLengthMAIN = parseFloat(size);

			hexHeightMAIN = Math.sin(hexagonAngle) * sideLengthMAIN;
			hexRadiusMAIN = Math.cos(hexagonAngle) * sideLengthMAIN;
			hexRectangleHeightMAIN = sideLengthMAIN + 2 * hexHeightMAIN;
			hexRectangleWidthMAIN = 2 * hexRadiusMAIN;

			ctx.strokeStyle = border;
			ctx.lineWidth = borderWidth;

			for(var x = 0; x * hexRectangleWidthMAIN < state.w - hexRectangleWidthMAIN; x++) {
				for(var y = 0; y * hexRadiusMAIN < state.h; y++) {
					var xPos = x * hexRectangleWidthMAIN + ((y % 2) * hexRadiusMAIN);
					var yPos = y * (sideLengthMAIN + hexHeightMAIN);
					var d = Math.sqrt( Math.pow(state.xCenter - xPos, 2) + Math.pow(state.yCenter - yPos, 2) );

					if (Math.pow(xPos-state.xCenter,2) +
						Math.pow(yPos-state.yCenter,2) < Math.pow(db*distance,2) ) {
						service.drawHexagon(
							ctx,
							xPos, yPos,
							x, y,
							d,
							(sideLengthMAIN *
							(db * dbImpact) *
							(1-(d/stretch)) ),
							genColors.convert.rgba(fill, 1- (d / fillOpacity ) )
						);
					}
				}
			}
		}
	}
})();