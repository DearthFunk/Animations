(function () {
	'use strict';
	angular
		.module('animations')
		.factory('lineConnections', lineConnections);

	lineConnections.inject = [];

	function lineConnections() {

		var service = {
			mouseDownEvent: mouseDownEvent,
			draw: draw
		};

		var galaxyStars = [];
		var galaxyTotalStars = 400;
		var lineFlux = 50;
		var orbitFlux = 100;
		var speed = 0.03;
		var hPadding = 360;
		var wPadding = 160;
		var twoPI = Math.PI * 2;

		for (var i = 0; i < galaxyTotalStars; i++) {
			galaxyStars.push({
				x: Math.random(),
				y: Math.random(),
				xD: 0,
				yD: 0,
				size: Math.random() + 0.01,
				angle: 0,
				speed: Math.random() * speed + 0.01,
				orbit: Math.random() * orbitFlux
			});
		}

		return service;

		///////////////////////////////////////

		function mouseDownEvent(e, state) {
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			ctx.fillStyle = '#FFFFFF';
			var w = state.w-(wPadding*2);
			var h = state.h-(hPadding*2);
			for (i = 0; i < galaxyStars.length; i++) {
				var star = galaxyStars[i];

				star.angle += star.speed;
				star.xD = wPadding + Math.floor(star.x * w + ( Math.cos(i + star.angle) * star.orbit));
				star.yD = hPadding + Math.floor(star.y * h + ( Math.sin(i + star.angle) * star.orbit));

				ctx.beginPath();
				ctx.arc(star.xD, star.yD, star.size, 0, twoPI, true);
				ctx.fill();
				ctx.closePath();
			}

			for (var a = 0; a < galaxyStars.length; a++) {
				var p1 = galaxyStars[a];
				for (var b = a; b < galaxyStars.length; b++) {
					var p2 = galaxyStars[b];
					var d = Math.sqrt( Math.pow(p1.xD - p2.xD, 2) + Math.pow(p1.yD - p2.yD, 2) );
					if (d < lineFlux) {

						ctx.beginPath();
						ctx.strokeStyle = 'rgba(255,0,0,' + d/lineFlux + ')';
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