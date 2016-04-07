(function () {
	'use strict';
	angular
		.module('animations')
		.factory('mountains', mountains);

	mountains.$inject = ['audioService'];

	function mountains(audioService) {

		var service = {
			draw: draw
		};
		var color = '#00FF00';
		var thickness = 10;
		
		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var freqArray = audioService.getFreqArray();

			ctx.beginPath();
			ctx.lineWidth = thickness;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.strokeStyle = color;

			for (var index = 0; index < freqArray.length; index++) {
				var chunkHeight = parseInt((freqArray[index] * state.h / 256 * -1),10);
				var chunkHeight2 = parseInt((freqArray[index+1] * state.h / 256 * -1),10);
				var chunkWidth = state.w / (audioService.audioBufferSize/2) * 2;
				ctx.moveTo(index*chunkWidth + (chunkWidth/2), chunkHeight + state.h - 5);
				ctx.lineTo(index*chunkWidth + (chunkWidth*1.5), chunkHeight2 + state.h - 5);
			}
			ctx.stroke();
		}
	}
})();