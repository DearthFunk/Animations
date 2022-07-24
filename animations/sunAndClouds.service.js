(function () {
	'use strict';
	angular
		.module('animations')
		.factory('sunAndClouds', sunAndClouds);

	sunAndClouds.$inject = ['genColors', 'audioService'];

	function sunAndClouds(genColors, audioService) {

		var service = {
			draw: draw
		};
		var minSunSize = 70;
		var cloudGrowth = 0.8;
		var sunGrowth = 2;
		var sunColor = '#FFFF00';
		var showScope = true;
		var techniClouds = false;
		var cloudColor = '#FFFFFF';
		var scopeColor = '#FFFFFF';
		var centerSun = false;
		var flare = document.createElement('img');
		flare.src = 'media/flare3.png';
		var percent2;
		var padding = 2;
		var crossover = 4.5;
		var bottomOffset = 100;

		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var db = audioService.getAverageDB();
			var freqArray = audioService.getFreqArray();
			var timeArray = audioService.getTimeArray();

			if (!centerSun) {
				centerSun = {
					x: state.xCenter,
					y: state.yCenter,
					r: 0
				};
			}

			//---------------------LENS FLARE
			if (db > 0) {
				ctx.drawImage(
					flare,
					state.xCenter - (flare.width/2),
					state.yCenter - (flare.height/2));
			}

			//---------------------SUN
			centerSun.r = db*sunGrowth > minSunSize ? db*sunGrowth : minSunSize;
			if (db>0) {
				ctx.beginPath();
				ctx.fillStyle = sunColor;
				ctx.arc(centerSun.x, centerSun.y, centerSun.r, 0, 2 * Math.PI, true);
				ctx.fill();
				ctx.closePath();
			}
			//--------------------SCOPE
			if (showScope && db>0) {
				var barWidth = (centerSun.r-padding) * 2 / timeArray.length;
				for (var index = 0; index < timeArray.length; index++) {
					var percent1 = timeArray[index] / 256;
					index < timeArray.length ?
						percent2 = timeArray[index+1] / 256 :
						percent2 = timeArray[index  ] / 256;

					var offset1, offset2;
					index == 0 ?
						offset1 = state.yCenter :
						offset1 = state.yCenter + (centerSun.r*2*(percent1-0.5));
					index == timeArray.length-1 ?
						offset2 = state.yCenter :
						offset2 = state.yCenter + (centerSun.r*2*(percent2-0.5));

					ctx.beginPath();
					ctx.lineWidth = 4;
					ctx.strokeStyle = scopeColor;
					ctx.moveTo(index*barWidth + padding +(state.xCenter-centerSun.r)           ,offset1);
					ctx.lineTo(index*barWidth + padding +(state.xCenter-centerSun.r) + barWidth,offset2);
					ctx.stroke();
					ctx.closePath();
				}
			}

			var chunkWidth = state.w / (audioService.audioBufferSize/2);

			//------------CLOUDS
			for (var i = 0; i < freqArray.length; i++) {
				ctx.beginPath();
				ctx.fillStyle = techniClouds ? genColors.random.hex() : cloudColor;

				//left
				ctx.arc(
					i * (chunkWidth * crossover),
					state.h + bottomOffset - freqArray[i],
					freqArray[i] * cloudGrowth,
					0, 2 * Math.PI, true);
				//right
				ctx.arc(
					state.w - (i * (chunkWidth * crossover)),
					state.h + bottomOffset - freqArray[i],
					freqArray[i] * cloudGrowth,
					0, 2 * Math.PI, true);

				ctx.fill();
				ctx.closePath();
			}
		}
	}
})();