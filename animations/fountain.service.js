(function () {
	'use strict';
	angular
		.module('animations')
		.factory('fountain', fountain);

	fountain.$inject = ['audioService', 'genColors'];

	function fountain(audioService, genColors) {

		var service = {
			draw: draw,
			fountainCircle: fountainCircle 
		};
		var padding = 0.5;
		var maxSize = 10;
		var xForce = 10;
		var yForce = 10;
		var reduction = 5;
		var total = 1000;
		var minColor = '#000000';
		var maxColor = '#FFFFFF';
		var fountainCircles = [];
		
		return service;

		//////////////////////////////////////////////////

		function fountainCircle (state) {
			// 1=top, 2=bottom
			var side = genColors.get.randomNumber(1,2,0);

			var padX = padding * state.w;
			var x = genColors.get.randomNumber(padX, state.w  - padX, 0);
			var y = state.h;

			var newCircle = {
				c: genColors.randomBetween.rgba(minColor,maxColor),
				r: genColors.get.randomNumber(maxSize/2,maxSize),
				side: side,
				xRem: genColors.get.randomNumber(-1 * xForce, xForce),
				yRem: genColors.get.randomNumber(yForce,20,0) * (genColors.get.randomNumber(0,1,0) == 0 ? -1 : 1)
			};

			switch (newCircle.side) {
				case 1: newCircle.x = x; newCircle.y = 0; break;
				case 2: newCircle.x = x; newCircle.y = state.h; break;
			}
			return newCircle;
		}
		
		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var dB = audioService.getAverageDB();

			for (var i = 0; i < fountainCircles.length; i++) {
				var circ = fountainCircles[i];
				circ.x += circ.xRem;
				circ.y += circ.yRem;
				circ.r -= (dB * (dB > 0 ? 20 : 10) / reduction / 2000) + 0.01;
			}

			//build new circles
			for (i = 0; i < total; i++) {
				if ( angular.isDefined(fountainCircles[i]) && fountainCircles[i].r < 0) { fountainCircles.splice(i,1); }
				if ( angular.isUndefined(fountainCircles[i]) && dB > 0) {
					if (genColors.get.randomNumber(0,10,0) == 0) { fountainCircles.push(service.fountainCircle(state)); }
				}

				if (angular.isDefined(fountainCircles[i])) {
					circ = fountainCircles[i];
					if (circ.x < 0) { circ.xRem = (circ.xRem * -1)}
					if (circ.y < 0) { circ.yRem = (circ.yRem * -1)}
					if (circ.x > state.w)  {circ.xRem = (circ.xRem * -1)}
					if (circ.y > state.h) {circ.yRem = (circ.yRem * -1)}
				}
			}

			//draw circles
			for ( i = 0; i < fountainCircles.length; i++) {
				if (fountainCircles[i].r > 0) {
					ctx.beginPath();
					ctx.arc(fountainCircles[i].x, fountainCircles[i].y, fountainCircles[i].r, 0, Math.PI*2, false);
					ctx.fillStyle = fountainCircles[i].c;
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}
})();