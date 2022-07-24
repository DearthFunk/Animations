(function () {
	'use strict';
	angular
		.module('animations')
		.factory('bars', bars);

	bars.$inject = ['audioService'];

	function bars(audioService) {

		var service = {
			draw: draw
		};
		var barsWidth = 5;
		var borderWidth = 1;
		var color = '#3F00ED';
		var borderColor = '#FFFFFF';
		
		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var freqArray = audioService.getFreqArray();
			var section = state.w / (audioService.audioBufferSize/2);
			var spacer = section * 0.2;
			var chunkWidth = section - spacer;

			for (var index = 0; index < freqArray.length; index++) {
				var chunkHeight = parseInt((freqArray[index] * -2),10);
				ctx.beginPath();
				ctx.rect(index * chunkWidth * barsWidth,
					state.h + (borderWidth/2),
					chunkWidth * barsWidth,
					chunkHeight);
				ctx.strokeStyle = borderColor;
				ctx.lineWidth = borderWidth;
				ctx.fillStyle = color;
				ctx.fill();
				ctx.stroke();
			}
		}
	}
})();