(function () {
	'use strict';
	angular
		.module('animations')
		.factory('bumps', bumps);

	bumps.$inject = ['audioService'];

	function bumps(audioService) {

		var service = {
			draw: draw
		};
		
		var leftOfset = 5;
		var topOffset = 5;
		var index, chunkHeight, chunkHeight2;
		var topLeft = '#00FF00';
		var topRight = '#FFFF00';
		var bottomLeft = '#FFFF00';
		var bottomRight = '#00FF00';
		var mirror = true;
		var total = 10; //less than 10
		
		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			ctx.lineWidth = 1;
			var freqArray = audioService.getFreqArray(50);
			var chunkWidth = state.xCenter/freqArray.length;

			for (var i = 1; i < total; i++) {

				ctx.beginPath();
				ctx.strokeStyle = bottomLeft;
				for (index = 0; index < freqArray.length; index++) {
					chunkHeight = parseInt((freqArray[index] * state.h / 256 * -1),10) / i;
					chunkHeight2 = parseInt((freqArray[index+1] * state.h / 256 * -1),10) / i;
					ctx.moveTo((freqArray.length-index)*chunkWidth + (chunkWidth*1.5) - leftOfset, chunkHeight + state.h-topOffset);
					ctx.lineTo((freqArray.length-index)*chunkWidth + (chunkWidth/2) - leftOfset, chunkHeight2 + state.h-topOffset);
				}
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.strokeStyle = bottomRight;
				for (index = 0; index < freqArray.length; index++) {
					chunkHeight = parseInt((freqArray[index] * state.h / 256 * -1),10) / i;
					chunkHeight2 = parseInt((freqArray[index+1] * state.h / 256 * -1),10) / i;
					ctx.moveTo(index*chunkWidth + (chunkWidth/2)   + (state.xCenter) - leftOfset, chunkHeight  + state.h-topOffset);
					ctx.lineTo(index*chunkWidth + (chunkWidth*1.5) + (state.xCenter) - leftOfset, chunkHeight2 + state.h-topOffset);
				}
				ctx.stroke();
				ctx.closePath();
			}
			if (mirror) {
				for (i = 1; i < total; i++) {
					ctx.beginPath();
					ctx.strokeStyle = topLeft;
					for (index = 0; index < freqArray.length; index++) {
						chunkHeight = parseInt((freqArray[index] * state.h / 256),10) / i;
						chunkHeight2 = parseInt((freqArray[index+1] * state.h / 256),10) / i;
						ctx.moveTo((freqArray.length-index)*chunkWidth + (chunkWidth*1.5) - leftOfset,  chunkHeight + topOffset);
						ctx.lineTo((freqArray.length-index)*chunkWidth + (chunkWidth/2) - leftOfset,  chunkHeight2 + topOffset);
					}
					ctx.stroke();
					ctx.closePath();

					ctx.beginPath();
					ctx.strokeStyle = topRight;
					for (index = 0; index < freqArray.length; index++) {
						chunkHeight = parseInt((freqArray[index] * state.h / 256),10) / i;
						chunkHeight2 = parseInt((freqArray[index+1] * state.h / 256),10) / i;
						ctx.moveTo(index*chunkWidth + (chunkWidth/2)   + (state.xCenter) - leftOfset, chunkHeight + topOffset);
						ctx.lineTo(index*chunkWidth + (chunkWidth*1.5) + (state.xCenter) - leftOfset, chunkHeight2 + topOffset);
					}
					ctx.stroke();
					ctx.closePath();
				}
			}
		}
	}
})();