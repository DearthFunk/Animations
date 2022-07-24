(function () {
	'use strict';
	angular
		.module('animations')
		.factory('circleThreads', circleThreads);

	circleThreads.$inject = ['audioService', 'genColors'];

	function circleThreads(audioService, genColors) {

		var service = {
			draw: draw,
			circleThread: circleThread
		};
		var color = '#666666';
		var highlightColor = '#0000AA';
		var highlightConsistency = 2;
		var radiusSpeed = 6;
		var columns = 30;
		var decaySpeed = 5;
		var reverse = true;
		var paddingSides = 150;
		var totalPerColumn = 30;
		var circleThreads = [];
		
		return service;

		//////////////////////////////////////////////////

		function circleThread(state) {
			return {
				r:reverse ? state.yCenter : 0,
				radiusSpeed: genColors.get.randomNumber(radiusSpeed/2 , radiusSpeed, 10)
			}
		}
		
		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var freqArray = audioService.getFreqArray(100);
			var freqIndex = Math.floor(freqArray.length /columns);
			var chunkWidth = Math.floor((state.w - (paddingSides*2) ) /columns);

			for (var column = 0; column <columns; column++) {
				if (angular.isUndefined(circleThreads[column])) {circleThreads[column] = [];}
				var freq = freqArray[freqIndex * column];
				for ( var i = 0; i <totalPerColumn; i++) {
					if (angular.isUndefined(circleThreads[column][i])) {circleThreads[column].push(service.circleThread(state));}


					if(reverse ) {
						freq > 0 ?
							circleThreads[column][i].r -= (circleThreads[column][i].radiusSpeed + genColors.get.randomNumber(1,5, 0) ):
							circleThreads[column][i].r += (circleThreads[column][i].radiusSpeed *decaySpeed);

					}
					else {
						freq > 0  ?
							circleThreads[column][i].r += (circleThreads[column][i].radiusSpeed + genColors.get.randomNumber(1,5, 0)) :
							circleThreads[column][i].r -= (circleThreads[column][i].radiusSpeed *decaySpeed);

					}

					if (circleThreads[column][i].r > 0 && circleThreads[column][i].r < state.yCenter) {

						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.arc(
							parseInt(paddingSides,10) + ( (column + 0.5) * chunkWidth) ,
							state.yCenter,
							circleThreads[column][i].r, 0, Math.PI*2, false);
						ctx.strokeStyle = genColors.convert.rgba(
							i % parseInt(highlightConsistency,10) == 0 ?
								highlightColor :
								color,
							1 - (circleThreads[column][i].r / (state.yCenter)));
						ctx.stroke();

					}
					else {
						var chance = genColors.get.randomNumber(1,10,0);
						if (chance == 1) {circleThreads[column][i] = service.circleThread(state);}
					}

				}
			}
		}
	}
})();