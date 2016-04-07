(function () {
	'use strict';
	angular
		.module('animations')
		.factory('circleSides', circleSides);

	circleSides.$inject = ['audioService', 'genColors'];

	function circleSides(audioService, genColors) {

		var service = {
			draw: draw,
			createNewCircle: createNewCircle
		};
		var padding = 0;
		var opacity = 1;
		var squeeze = 0;
		var speed = 80; //inverted
		var reduction = 0.1;
		var total = 1000;
		var maxSize = 10;
		var colorMin = '#000000';
		var colorMax = '#FFFFFF';
		var side = [true,true,true,true];
		var circlesX4 = [];

		return service;

		//////////////////////////////////////////////////

		function createNewCircle (state) {
			var padX = padding * state.w;
			var padY = padding * state.h;
			var x = genColors.get.randomNumber(padX, state.w - padX, 0);
			var y = genColors.get.randomNumber(padY, state.h - padY, 0);
			var newCircle = {
				removal: genColors.get.randomNumber(1,20),
				c: genColors.randomBetween.rgba(colorMin,colorMax,parseFloat(opacity)),
				r: genColors.get.randomNumber(maxSize/2,maxSize),
				side: genColors.get.randomNumber(1,4,0)
			};

			switch (newCircle.side) {
				// 1=top, 2=bottom, 3=left, 4=right
				case 1: newCircle.x = x; newCircle.y = 0; break;
				case 2: newCircle.x = x; newCircle.y = state.h; break;
				case 3: newCircle.x = 0; newCircle.y = y; break;
				case 4: newCircle.x = state.w; newCircle.y = y;
			}
			return newCircle;
		}
		
		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var dB = audioService.getAverageDB();
			var yM = state.yCenter;
			var xM = state.xCenter;

			var speedAdjust = dB / speed;
			for (var i = 0; i < circlesX4.length; i++) {
				//LEFT TO RIGHT EDITS
				if (circlesX4[i].side == 3 || circlesX4[i].side == 4) {
					if (circlesX4[i].y > yM) { circlesX4[i].y - squeeze < yM ? circlesX4[i].y = yM : circlesX4[i].y -= squeeze; }
					if (circlesX4[i].y < yM) { circlesX4[i].y + squeeze > yM ? circlesX4[i].y = yM : circlesX4[i].y += squeeze;	}
				}
				if (circlesX4[i].side == 3) {circlesX4[i].x += (circlesX4[i].removal * speedAdjust);}
				if (circlesX4[i].side == 4) {circlesX4[i].x -= (circlesX4[i].removal * speedAdjust);}

				//TOP TO BOTTOM EDITS
				if (circlesX4[i].side == 1 || circlesX4[i].side == 2) {
					if (circlesX4[i].x > xM) { circlesX4[i].x - squeeze < xM ? circlesX4[i].x = xM : circlesX4[i].x -= (squeeze*3); }
					if (circlesX4[i].x < xM) { circlesX4[i].x + squeeze > xM ? circlesX4[i].x = xM : circlesX4[i].x += (squeeze*3);	}
				}
				if (circlesX4[i].side == 1) {circlesX4[i].y += (circlesX4[i].removal * speedAdjust);}
				if (circlesX4[i].side == 2) {circlesX4[i].y -= (circlesX4[i].removal * speedAdjust);}

				//radius edit for all
				circlesX4[i].r -= (dB > 0 ? reduction : reduction * 8) ;
			}


			//build new circles
			for (i = 0; i < total; i++) {
				if (circlesX4[i] == undefined && dB > 0) {
					circlesX4.push(service.createNewCircle(state));
				}
				if (circlesX4[i] != undefined){
					if (circlesX4[i].r < 0 ||
						circlesX4[i].x < -310 ||
						circlesX4[i].x > state.w + 310 ||
						circlesX4[i].y < -310 ||
						circlesX4[i].y > state.h + 310) {
						circlesX4.splice(i,1);
					}
				}
			}

			//draw circles
			for ( i = 0; i < circlesX4.length; i++) {
				if (circlesX4[i].r > 0) {
					if (side[circlesX4[i].side-1]) {
						ctx.beginPath();
						ctx.arc(circlesX4[i].x, circlesX4[i].y, circlesX4[i].r, 0, Math.PI*2, false);
						ctx.fillStyle = circlesX4[i].c;
						ctx.fill();
						ctx.closePath();
					}

				}
			}
		}
	}
})();