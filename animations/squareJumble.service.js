(function () {
	'use strict';
	angular
		.module('animations')
		.factory('squareJumble', squareJumble);

	squareJumble.$inject = ['genColors', 'audioService'];

	function squareJumble(genColors, audioService) {

		var service = {
			draw: draw
		};
		var padding = 5;
		var cellSize = 40;
		var growth = 0.2;
		var borderColor = '#FFFFFF';
		var borderColorQuiet = '#555555';
		var borderColorDb = '##0000FF';
		var fillColor = '#00FF00';
		
		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var freqArray = audioService.getFreqArray();
			var dB = Math.round( (audioService.getAverageDB() / 75) * 10) / 10;
			var horizontalCells = (parseInt( state.h / (padding * 2 + cellSize ), 10) + 1);
			var verticalCells = (parseInt( state.w  / (padding * 2 + cellSize ), 10) + 1);

			for (var xRow = 0; xRow < verticalCells; xRow++) {
				for (var yRow = horizontalCells; yRow >= 0; yRow--) {

					var x = (xRow * (padding * 2 + cellSize)) - padding;
					var y = (yRow * (padding * 2 + cellSize)) - padding;
					var additionalSizing = yRow/horizontalCells >  freqArray[xRow*3]/255 ?
						(freqArray[xRow*3] * growth) :
						0;

					ctx.beginPath();
					ctx.strokeStyle =
						additionalSizing == 0 ?
							dB > 0 ?
								borderColor :
								genColors.convert.rgba(borderColorQuiet,0.2)
							: borderColorDb;

					ctx.fillStyle = genColors.convert.rgba(fillColor,additionalSizing == 0 ? 0 : 0.2);
					ctx.lineWidth = 1;

					ctx.rect(
						x + (padding*2) - (additionalSizing/2),
						y + (padding*2) - (additionalSizing/2),
						cellSize + additionalSizing,
						cellSize + additionalSizing);

					ctx.stroke();
					ctx.fill();
					ctx.closePath();

				}}
		}
	}
})();