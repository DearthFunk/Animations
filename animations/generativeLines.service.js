(function () {
	'use strict';
	angular
		.module('animations')
		.factory('generativeLines', generativeLines);

	generativeLines.$inject = ['genColors'];

	function generativeLines(genColors) {

		var service = {
			draw: draw,
			initialize: initialize,
			mouseDownEvent: mouseDownEvent
		};

		var points = [];
		var totalPoints = 50;
		var initialized = false;
		var flux = 100;
		return service;

		////////////////////////////////////////////////

		function initialize(state) {
			var spacing = state.w / totalPoints;
			for (var i = 0; i < totalPoints+1; i++) {
				points.push({
					x: i * spacing,
					f: genColors.get.randomNumber(-flux + 2, flux - 2, 0),
					speed: genColors.get.randomNumber(0.1, 1)
				});
			}
			initialized = true;

		}

		function mouseDownEvent(e, state) {

		}

		function draw(ctx, state) {
			if (!initialized) { service.initialize(state);}
			ctx.clearRect(0,0,state.w, state.h);

			// make point adjustments
			for (var i = 0; i < points.length; i++) {
				var p = points[i];
				if (p.f > flux || p.f < -flux) {
					p.speed *= -1;
				}
				p.f += p.speed;
			}

			// draw line
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			ctx.beginPath();
			ctx.moveTo(points[0].x, points[0].y);
			for (i = 1; i < points.length; i++) {
				ctx.lineTo(points[i].x, state.h / 2 + points[i].f);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
})();