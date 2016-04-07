(function () {
	'use strict';
	angular
		.module('animations')
		.factory('barcode', barcode);

	barcode.$inject = ['audioService'];

	function barcode(audioService) {

		var service = {
			draw: draw
		};
		var thickness = 20;
		var total = 10;
		var color ='#FFFFFF';
		var spacing = 10;

		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var freqData = audioService.getSmallArray(spacing);
			ctx.beginPath();
			ctx.lineWidth = thickness;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.strokeStyle = color;

			var chunkWidth = state.xCenter / freqData.length;

			for (var i = 1; i < total; i++) {
				for (var index = freqData.length; index > 0; index--) {
					var chunkHeight = parseInt((freqData[index] * state.h / 256 * -1),10) / i;
					var chunkHeight2 = parseInt((freqData[index+1] * state.h / 256 * -1),10) / i;
					ctx.moveTo((freqData.length-index)*chunkWidth, chunkHeight + state.h-5);
					ctx.lineTo((freqData.length-index)*chunkWidth, chunkHeight2 + state.h-5);
				}
				for (index = 0; index < freqData.length; index++) {
					chunkHeight = parseInt((freqData[index] * state.h / 256 * -1),10) / i;
					chunkHeight2 = parseInt((freqData[index+1] * state.h / 256 * -1),10) / i;
					ctx.moveTo(index*chunkWidth + (state.xCenter), chunkHeight  + state.h-5);
					ctx.lineTo(index*chunkWidth + (state.xCenter), chunkHeight2 + state.h-5);
				}
				ctx.stroke();
			}
		}
	}
})();