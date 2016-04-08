(function () {
	'use strict';
	angular
		.module('animations')
		.factory('lineConnectionsTwo', lineConnectionsTwo);

	lineConnectionsTwo.inject = [];

	function lineConnectionsTwo() {

		var service = {
			mouseDownEvent: mouseDownEvent,
			draw: draw
		};

		var galaxyStars = [];
		var galaxyTotalStars = 800;
		var lineFlux = 50;
		var orbitFlux = 100;
		var speed = 4;
		var screenPadding = 120;

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
			for (i = 0; i < galaxyStars.length; i++) {
				var star = galaxyStars[i];

				galaxyStars[i].angle += (star.speed / 100);
				galaxyStars[i].xD = screenPadding + Math.floor((star.x * (state.w-(screenPadding*2))) + ( Math.cos(i + star.angle) * star.orbit));
				galaxyStars[i].yD = screenPadding + Math.floor((star.y * (state.h-(screenPadding*2))) + ( Math.sin(i + star.angle) * star.orbit));

				ctx.beginPath();
				ctx.fillStyle = '#FFFFFF';
				ctx.arc(galaxyStars[i].xD, galaxyStars[i].yD, galaxyStars[i].size, 0, Math.PI*2, true);
				ctx.fill();
				ctx.closePath();
			}


			for (var a = 0; a < galaxyStars.length; a++) {
				for (var b = a; b < galaxyStars.length; b++) {
					var p1 = galaxyStars[a];
					var p2 = galaxyStars[b];
					var d = Math.sqrt( Math.pow(p1.xD - p2.xD, 2) + Math.pow(p1.yD - p2.yD, 2) );
					if (d < lineFlux) {

						ctx.beginPath();
						ctx.strokeStyle = 'rgba(255,0,0,' + d/lineFlux + ')';
						ctx.lineWidth = 1 - (d/lineFlux);

						ctx.moveTo(Math.floor(p1.xD), Math.floor(p1.yD));
						ctx.lineTo(Math.floor(p2.xD), Math.floor(p2.yD));
						ctx.stroke();
						ctx.closePath();
					}
				}
			}
		}
	}
})();