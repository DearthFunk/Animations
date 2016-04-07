(function () {
	'use strict';
	angular
		.module('animations')
		.factory('rectangleBlur', rectangleBlur);

	rectangleBlur.$inject = ['genColors', 'audioService'];

	function rectangleBlur(genColors, audioService) {

		var service = {
			draw: draw,
			rectCircle: rectCircle
		};
		var barColor = '#660000';
		var barBorder = '#FFFFFF';
		var circleColor = '#FF0000';
		var columns = 50;
		var totalCircles = 1000;
		var circleMaxSize = 100;
		var circleReduction = 5;
		var paddingSides = 50;
		var spacing = 5;
		var cellSize = 30;
		var rectCircles = [];
		
		return service;

		//////////////////////////////////////////////////

		function rectCircle(state) {
			return {
				x: genColors.get.randomNumber(paddingSides, state.w - paddingSides),
				y: state.yCenter,
				r: genColors.get.randomNumber(0,circleMaxSize),
				xAdd:genColors.get.randomNumber(-1,1, 4),
				yAdd:genColors.get.randomNumber(-1,1, 4)
			}
		}
		
		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var dbLevel = audioService.getAverageDB();
			var freqArray = audioService.getFreqArray();
			freqArray.splice(freqArray.length-200,200);
			var freqIndex = Math.floor(freqArray.length / columns);
			var chunkWidth = (state.w - (paddingSides*2) ) / columns;
			ctx.lineWidth = 1;

			var circleReduction = Math.floor(circleReduction)/10;
			for ( i =0; i < totalCircles; i++ ) {
				if (angular.isUndefined(rectCircles[i])) {
					rectCircles.push(service.rectCircle(state));
				}
				rectCircles[i].x += rectCircles[i].xAdd;
				rectCircles[i].y += rectCircles[i].yAdd;
				rectCircles[i].r -= genColors.get.randomNumber(Math.floor(circleReduction/2),circleReduction);

				if (rectCircles[i].r < 0 ) {
					rectCircles[i] = service.rectCircle(state);
				}

				ctx.beginPath();
				ctx.arc(
					rectCircles[i].x,
					rectCircles[i].y,
					rectCircles[i].r,
					0, Math.PI*2, false);
				ctx.fillStyle = genColors.convert.rgba(circleColor, dbLevel/120 );
				ctx.fill();

			}


			for (var column = 0; column < columns; column++) {

				var chunkHeight = parseInt((freqArray[column*freqIndex] * -2),10);
				var numOfCells = Math.floor(chunkHeight/cellSize);

				for ( var i = -1; i > numOfCells; i--) {
					for (var topBottom = 0; topBottom < 2; topBottom++) {

						ctx.beginPath();
						ctx.strokeStyle = genColors.convert.rgba(barBorder, (1 - (i / (numOfCells-1))).toFixed(1) );
						ctx.rect(
							paddingSides + (column*chunkWidth) + spacing,
							topBottom == 0 ?
							state.yCenter - (i*cellSize) + 5:
							state.yCenter - 5,
							chunkWidth - (spacing*2),
							i * cellSize
						);
						ctx.stroke();

						if (i > numOfCells/2) {
							ctx.fillStyle =barColor;
							ctx.fill();
						}
					}
				}

			}
		}
	}
})();