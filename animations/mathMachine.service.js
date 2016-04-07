(function () {
	'use strict';
	angular
		.module('animations')
		.factory('mathMachine', mathMachine);

	mathMachine.$inject = ['genColors', 'audioService'];

	function mathMachine(genColors, audioService) {

		var service = {
			draw: draw
		};
		var totalLevels = 15;
		var totalSquares = 10;
		var additionalRad = 40;
		var pointLines = false;
		var dbOpacity = true;
		var squareColor = '#FFFFFF';
		
		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var points = [];
			var freqData = audioService.getFreqArray();
			var opacity = audioService.getAverageDB() / 75;
			var freqInterval = parseInt(255 / (4 * totalSquares),10);

			dbOpacity ?
				ctx.strokeStyle = genColors.convert.rgba(squareColor,opacity) :
				ctx.strokeStyle = squareColor;

			var center = {
				x: state.xCenter,
				y: state.yCenter
			};

			for (var i = 0; i < totalSquares * 4; i++) {
				points.push({
					x: Math.cos(i * 360 / (totalSquares * 4) * (Math.PI / 180)),
					y: Math.sin(i * 360 / (totalSquares * 4) * (Math.PI / 180))
				});
			}

			ctx.lineWidth = 1;

			for (var lvl = totalLevels; lvl > 0; lvl-- ) {
				for ( var squareNum = 1; squareNum < (totalSquares+1); squareNum++) {

					var pointIndex1 = squareNum+(0)-1;
					var pointIndex2 = squareNum+(totalSquares)-1;
					var pointIndex3 = squareNum+(totalSquares*2)-1;
					var pointIndex4 = squareNum+(totalSquares*3)-1;
					var rad1 = freqData[(0)*freqInterval] / (lvl/1.5) + additionalRad;
					var rad2 = freqData[(squareNum)*freqInterval] / (lvl/1.5) + additionalRad;
					var rad3 = freqData[(squareNum*2)*freqInterval] / (lvl/1.5) + additionalRad;
					var rad4 = freqData[(squareNum*3)*freqInterval] / (lvl/1.5) + additionalRad;
					var point1 = {x:center.x + (rad1 * points[pointIndex1].x),  y:center.y + (rad1 * points[pointIndex1].y)};
					var point2 = {x:center.x + (rad2 * points[pointIndex2].x),  y:center.y + (rad2 * points[pointIndex2].y)};
					var point3 = {x:center.x + (rad3 * points[pointIndex3].x),  y:center.y + (rad3 * points[pointIndex3].y)};
					var point4 = {x:center.x + (rad4 * points[pointIndex4].x),  y:center.y + (rad4 * points[pointIndex4].y)};

					ctx.beginPath();
					ctx.moveTo(point1.x, point1.y);
					ctx.lineTo(point2.x, point2.y);
					ctx.lineTo(point3.x, point3.y);
					ctx.lineTo(point4.x, point4.y);
					ctx.lineTo(point1.x, point1.y);
					ctx.stroke();

					if (lvl == 1 && pointLines) {
						ctx.moveTo(center.x, center.y); ctx.lineTo(point1.x, point1.y);
						ctx.moveTo(center.x, center.y);	ctx.lineTo(point2.x, point2.y);
						ctx.moveTo(center.x, center.y); ctx.lineTo(point3.x, point3.y);
						ctx.moveTo(center.x, center.y);	ctx.lineTo(point4.x, point4.y);
						ctx.stroke();
					}
				}
			}
		}
	}
})();