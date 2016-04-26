(function () {
	'use strict';
	angular
		.module('animations')
		.factory('lineClusters', lineClusters);

	lineClusters.inject = ['genColors'];

	function lineClusters(genColors) {

		var service = {
			mouseDownEvent: mouseDownEvent,
			draw: draw
		};

		var totalClusters = 30;
		var totalDotsPerCluster = 30;
		var clusters = [];
		var hPadding = 360;
		var wPadding = 160;

		setup();

		return service;

		///////////////////////////////////////

		function setup() {
			for (var i = 0; i < totalClusters; i++) {
				clusters.push({
					dots: [],
					x: Math.random(),
					y: Math.random(),
					xD: 0,
					yD: 0,
					angle: 0,
					speed: genColors.get.randomNumber(0.01, 0.03, 4),
					orbit: genColors.get.randomNumber(0,100,4)
				});
			}
		}

		function mouseDownEvent(e, state) {
		}

		function newRingDot () {
			return {
				r: genColors.get.randomNumber(2,10),
				speed: genColors.get.randomNumber(0.003,0.009) * (Math.random() > 0.5 ? 1 : -1),
				orbit: genColors.get.randomNumber(0,10),
				angle: 0
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			ctx.fillStyle = '#FFFFFF';
			ctx.strokeStyle = '#FF0000';

			var w = state.w-(wPadding*2);
			var h = state.h-(hPadding*2);

			for (var i = 0; i < clusters.length; i++) {
				var cluster = clusters[i];
				cluster.angle += cluster.speed;
				cluster.xD = wPadding + Math.floor(cluster.x * w + ( Math.cos(i + cluster.angle) * cluster.orbit));
				cluster.yD = hPadding + Math.floor(cluster.y * h + ( Math.sin(i + cluster.angle) * cluster.orbit));

				for (var ii = 0; ii < totalDotsPerCluster; ii++) {
					if (angular.isUndefined(cluster.dots[ii])) {
						cluster.dots.push(newRingDot());
					}

					var dot = cluster.dots[ii];
					dot.r -= 0.009;
					dot.angle += dot.speed;

					if (dot.r < 0) {
						cluster.dots[ii] = newRingDot();
					}
					else {
						ctx.beginPath();
						ctx.arc(
							cluster.xD + Math.cos(ii + dot.angle) * dot.orbit * dot.angle * 4.5,
							cluster.yD + Math.sin(ii + dot.angle) * dot.orbit * dot.angle * 4.5,
							dot.r,
							0, Math.PI*2, true
						);
						ctx.fill();
						ctx.stroke();
						ctx.closePath();
					}
				}
			}
		}
	}
})();