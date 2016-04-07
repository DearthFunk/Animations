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
		var radiusCounter = 20;
		var totalCircles = 5;
		var linesPerLayer = 20;
		var circleSize = 120;
		var circlePadding = 2;
		var speed = 0.001;
		var dbSpeedImpact = 10000; //inverted
		var lineThickness = 5;
		var color = '#FFFFFF';

		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			var db = audioService.getAverageDB() + 1;

			radiusCounter = 20;
			spinnerRotate == 360 ? spinnerRotate = 0 : spinnerRotate += speed;
			spinnerRotate += (db/dbSpeedImpact);

			for (var circle = 0; circle <= totalCircles; circle++) {

				for (var i = 0; i < linesPerLayer; i++) {
					ctx.beginPath();
					ctx.strokeStyle = genColors.convert.rgba(color, 1-(circle/totalCircles));
					ctx.lineWidth = lineThickness;

					var rotateValue = circle % 2 == 0 ? spinnerRotate*-1 : spinnerRotate;

					var angle = i * (360 / linesPerLayer) * Math.PI/180 + rotateValue;
					var startX = state.xCenter + (radiusCounter + circlePadding + db) * Math.cos(angle);
					var startY = state.yCenter + (radiusCounter + circlePadding + db) * Math.sin(angle);
					var endX   = state.xCenter  + (radiusCounter - (circlePadding*2) + circleSize + db) * Math.cos(angle);
					var endY   = state.yCenter + (radiusCounter - (circlePadding*2) + circleSize + db) * Math.sin(angle);

					ctx.moveTo(startX,startY);
					ctx.lineTo(endX,endY);
					ctx.stroke();
				}
				radiusCounter += circleSize;
			}
		}
	}
})();