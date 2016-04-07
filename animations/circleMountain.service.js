(function () {
	'use strict';
	angular
		.module('animations')
		.factory('circleMountain', circleMountain);

	circleMountain.$inject = ['audioService'];

	function circleMountain(audioService) {

		var service = {
			draw: draw
		};
		var tipColor = '#00FF00';
		var tipThickness = 7;
		var color = '#B9B9B9';
		var columns = 50;
		var paddingBottom = 0;
		var paddingSides = 10;
		var radiusGrowth = 0.6;
		var verticalSpacing = 30;
		
		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var freqArray = audioService.getFreqArray();
			freqArray.splice(freqArray.length-150,150);
			var freqIndex = Math.floor(freqArray.length / columns);
			var chunkWidth = (state.w - (paddingSides*2) ) / columns;
			for (var column = 0; column < columns; column++) {
				var chunkHeight = parseInt((freqArray[column*freqIndex] * -3),10);
				var numOfCells = -1 * Math.floor(chunkHeight/verticalSpacing);
				for ( var i = 0; i < numOfCells; i++) {

					ctx.beginPath();
					ctx.arc(
						parseInt(paddingSides,10) + ( (column + 0.5) * chunkWidth),
						(state.h-paddingBottom) - (i*verticalSpacing),
						Math.pow(i*verticalSpacing,radiusGrowth) / 2,
						0, Math.PI*2, false);

					if (i == numOfCells-1) {
						ctx.lineWidth = tipThickness;
						ctx.strokeStyle = tipColor;
					}
					else {
						ctx.lineWidth = 1;
						ctx.strokeStyle = color;
					}
					ctx.stroke();
				}
			}
		}
	}
})();