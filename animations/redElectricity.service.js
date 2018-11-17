(function () {
	'use strict';
	angular
		.module('animations')
		.factory('redElectricity', redElectricity);

	redElectricity.inject = ['genColors'];

	function redElectricity(genColors) {

		var service = {
			mouseDownEvent: mouseDownEvent,
			draw: draw
		};

		var galaxyStars = [];
		var galaxyTotalStars = 350;
		var lineFlux = 100;
		var orbitFlux = 100;
		var screenPadding = 100;
		var mainColor = '#FF0000';
		var oddsOfWhiteLine = 15;
		var oddsOfBlueLine = 20;

		for (var i = 0; i < galaxyTotalStars; i++) {
			galaxyStars.push({
				x: Math.random(),
				y: Math.random(),
				xD: 0,
				yD: 0,
				angle: 0,
				speed: genColors.get.randomNumber(-0.01,0.01,5),
				orbit: Math.random() * orbitFlux
			});
		}

		return service;

		///////////////////////////////////////

		function mouseDownEvent(e, state) {
		}

		function draw(ctx, state) {
			//partial erase
			var oldArray = ctx.getImageData(0,0,state.w,state.h);
			for(var d=3;d<oldArray.data.length;d+=4){ //count through only the alpha pixels
				//dim it with some feedback
				oldArray.data[d] = Math.floor(oldArray.data[d]*.7);
			}
			ctx.putImageData(oldArray,0,0);

			var w = state.w-(screenPadding*2);
			var h = state.h-(screenPadding*2);
			for (i = 0; i < galaxyStars.length; i++) {
				var star = galaxyStars[i];
				star.angle += star.speed;
				star.xD = screenPadding + Math.floor(star.x * w + ( Math.cos(i + star.angle) * star.orbit));
				star.yD = screenPadding + Math.floor(star.y * h + ( Math.sin(i + star.angle) * star.orbit));
			}

			for (var a = 0; a < galaxyStars.length; a++) {
				var p1 = galaxyStars[a];
				var lineColor =
					genColors.get.randomNumber(1,oddsOfWhiteLine,0) === 1 ? '#FFFFFF' :
					genColors.get.randomNumber(1,oddsOfBlueLine,0) === 1 ? '#0000FF' :
					mainColor;
				for (var b = a; b < galaxyStars.length; b++) {
					var p2 = galaxyStars[b];
					d = Math.sqrt( Math.pow(p1.xD - p2.xD, 2) + Math.pow(p1.yD - p2.yD, 2) );
					if (d < lineFlux) {

						ctx.beginPath();

						ctx.strokeStyle = genColors.convert.rgba(lineColor,d/lineFlux);
						ctx.lineWidth = 1 - (d/lineFlux);

						ctx.moveTo(p1.xD, p1.yD);
						ctx.lineTo(p2.xD, p2.yD);
						ctx.stroke();
						ctx.closePath();
					}
				}
			}
		}
	}
})();