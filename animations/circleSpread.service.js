(function () {
	'use strict';
	angular
		.module('animations')
		.factory('circleSpread', circleSpread);

	circleSpread.$inject = ['audioService', 'genColors'];

	function circleSpread(audioService, genColors) {

		var service = {
			draw: draw,
			createNewCircle: createNewCircle
		};

		var padding = 100;
		var reduction = 3;
		var speedSolid = 3;
		var speedHighlight = 5;
		var squeeze = 0;
		var color = {
			min: '#000000',
			max: '#FFFFFF'};
		var solid = {
			total: 300,
			maxSize: 150};
		var highlight = {
			total: 40,
			maxSize: 300};
		var circS = [];
		var circH = [];

		return service;

		//////////////////////////////////////////////////

		function createNewCircle (startingRadius, state) {
			return {
				c: genColors.randomBetween.rgba(color.min,color.max, genColors.get.randomNumber(0,0.5,4)),
				r: genColors.get.randomNumber(1,startingRadius,0),
				x: state.w + genColors.get.randomNumber(0,40, 0),
				y: genColors.get.randomNumber(padding, state.h - padding, 0),
				xRemoval: genColors.get.randomNumber(1,20, 0)
			};
		}
		
		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var dB = audioService.getAverageDB();
			var center = state.yCenter;

			for ( i = 0; i < circS.length; i++) {
				if (circS[i].y > center) { circS[i].y - squeeze < center ? circS[i].y = center : circS[i].y -= squeeze;	}
				if (circS[i].y < center) { circS[i].y + squeeze > center ? circS[i].y = center : circS[i].y += squeeze;	}
				circS[i].x -= (circS[i].xRemoval * speedSolid);
				circS[i].r -= reduction;
			}
			for (var i = 0; i < solid.total; i++) {
				if (circS[i] == undefined && dB > 0) {
					var x = genColors.get.randomNumber(1,10,0);
					if (x == 1) {circS.push(
						service.createNewCircle(solid.maxSize, state)
						);
					}

				}
				if (circS[i] != undefined){
					if (circS[i].r < 0) {circS.splice(i,1);}
				}
			}

			for ( i = 0; i < circH.length; i++) {
				if (circH[i].y > center) { circH[i].y - squeeze < center ? circH[i].y = center : circH[i].y -= squeeze;	}
				if (circH[i].y < center) { circH[i].y + squeeze > center ? circH[i].y = center : circH[i].y += squeeze;	}
				circH[i].x -= (circH[i].xRemoval * speedHighlight);
				circH[i].r -= reduction;
			}
			for ( i = 0; i < highlight.total; i++) {
				if (circH[i] == undefined && dB > 0) {circH.push(
						service.createNewCircle(highlight.maxSize, state)
					);
				}
				if (circH[i] != undefined){
					if (circH[i].r < 0) {circH.splice(i,1);}
				}
			}

			ctx.shadowBlur = 0;
			ctx.shadowBlur = 14;
			ctx.shadowColor = '#000000';
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.lineWidth = 4;
			for ( i = 0; i < circH.length; i++) {
				if (circH[i].r > 0) {
					var grd = ctx.createRadialGradient(circH[i].x, circH[i].y, circH[i].r, circH[i].x, circH[i].y, 0);
					ctx.beginPath();
					ctx.arc(circH[i].x, circH[i].y, circH[i].r, 0, Math.PI*2, false);
					grd.addColorStop(0,  circH[i].c);
					grd.addColorStop(0.3,'rgba(0,0,0,0.5)');
					grd.addColorStop(1,  'rgba(0,0,0,1)');
					ctx.fillStyle = grd;
					ctx.fill();
					ctx.closePath();
				}
			}

			ctx.shadowBlur = 0;
			ctx.shadowColor = '';
			ctx.lineWidth = 0;
			for ( i = 0; i < circS.length; i++) {
				if (circS[i].r > 0) {
					ctx.beginPath();
					ctx.arc(circS[i].x, circS[i].y, circS[i].r, 0, Math.PI*2, false);
					ctx.fillStyle = circS[i].c;
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}
})();