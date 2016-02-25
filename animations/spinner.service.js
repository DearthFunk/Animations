(function () {
	'use strict';
	angular
		.module('animations')
		.factory('spinner', spinner);

	spinner.$inject = ['genColors', 'audioService'];

	function spinner(genColors, audioService) {

		var service = {
			draw: draw
		};
		var spinnerRotate = 0;
		var color = '#FFFFFF';
		var innerRadius = 20;
		var totalCircles = 5;
		var linesPerLayer = 20;
		var circleSize = 120;
		var circlePadding = 2;
		var speed = 0.01;
		var dbSpeedImpact = 1000;
		var lineThickness = 5;
		var dbStretch = 1;
		
		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {

			var db = audioService.getAverageDB();
			spinnerRotate === 360 ? spinnerRotate = 0 : spinnerRotate += speed;
			spinnerRotate += (db/parseFloat(dbSpeedImpact));
			spinnerRotate = spinnerRotate % Math.PI;
			console.log(spinnerRotate);
			for (var circle = 0; circle <= totalCircles; circle++) {

				for (var i = 0; i < linesPerLayer; i++) {

					var rotateValue = circle % 2 == 0 ? spinnerRotate*-1 : spinnerRotate;

					var angle = i * (360 / linesPerLayer) * Math.PI/180 + rotateValue;
					var dbAdjust =  db * dbStretch;
					var startX = state.xCenter  + (innerRadius + circlePadding + dbAdjust) * Math.cos(angle);
					var startY = state.yCenter + (innerRadius + circlePadding + dbAdjust) * Math.sin(angle);
					var endX   = state.xCenter  + (innerRadius - (circlePadding*2) + circleSize + dbAdjust) * Math.cos(angle);
					var endY   = state.yCenter + (innerRadius - (circlePadding*2) + circleSize + dbAdjust) * Math.sin(angle);

					ctx.beginPath();
					ctx.strokeStyle = genColors.convert.rgba(color,1-(circle/totalCircles));
					ctx.lineWidth = lineThickness;
					ctx.moveTo(startX,startY);
					ctx.lineTo(endX,endY);
					ctx.stroke();
					ctx.closePath();

				}

				innerRadius += circleSize;
			}
		}
	}
})();