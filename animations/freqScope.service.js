(function () {
	'use strict';
	angular
		.module('animations')
		.factory('freqScope', freqScope);

	freqScope.$inject = ['audioService'];

	function freqScope(audioService) {

		var service = {
			draw: draw
		};

		var color = '#FFFFFF';

		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var timeArray = audioService.getTimeArray();
			var barWidth = state.w / timeArray.length;
			ctx.beginPath();
			ctx.lineWidth = 4;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.strokeStyle = color;

			for (var i = 0; i < timeArray.length; i++) {
				var percent = timeArray[i] / 256;
				var percent2 = i < timeArray.length ? timeArray[i+1] / 256 : timeArray[i] / 256;
				var height = state.h * percent;
				var height2 = state.h * percent2;
				var offset = state.h - height - 1;
				var offset2 = state.h - height2 - 1;
				ctx.moveTo(i*barWidth,offset);
				ctx.lineTo(i*barWidth+barWidth,offset2);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
})();