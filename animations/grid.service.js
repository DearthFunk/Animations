(function () {
	'use strict';
	angular
		.module('animations')
		.factory('grid', grid);

	grid.$inject = ['audioService', 'genColors'];

	function grid(audioService, genColors) {

		var service = {
			draw: draw
		};
		var spacing = 1;
		var cellSize = 20;
		var dbOpacity = false;
		var dBOffBaseOpacity = 0.5;
		var colorTop = '#FFFFFF';
		var colorBot = '#000000';
		
		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var freqData = audioService.getFreqArray();
			var dB = Math.round( (audioService.getAverageDB() / 75) * 10) / 10;

			var clrTopDbOn  = genColors.convert.rgba(colorTop, dB);
			var clrBotDbOn  = genColors.convert.rgba(colorBot, dB);
			var clrTopDbOff = genColors.convert.rgba(colorTop, dBOffBaseOpacity);
			var clrBotDbOff = genColors.convert.rgba(colorBot, dBOffBaseOpacity);

			for (var y = 0; y < (parseInt(state.h / (cellSize+spacing),10) + 1); y++) {
				for (var x = 0; x < (parseInt(state.w  / (cellSize+spacing),10) + 1); x++) {

					if (dB > 0 && freqData[x] > 0 && y < freqData[x]/(spacing+cellSize)*3) {
						dbOpacity ? ctx.fillStyle = clrTopDbOn : ctx.fillStyle = clrTopDbOff;
					}
					else {
						dbOpacity ? ctx.fillStyle = clrBotDbOn : ctx.fillStyle = clrBotDbOff;
					}

					ctx.beginPath();
					ctx.rect(spacing + (x * (cellSize+spacing)), spacing + (y * (cellSize+spacing)), cellSize, cellSize);
					ctx.fill();

				}
			}
		}
	}
})();