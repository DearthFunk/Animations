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

		var lineColor, outlineColor, color1, color2;
		var totalClusters = 100;
		var totalDotsPerCluster = 15;
		var clusters = [];
		var hPadding = 460;
		var wPadding = 160;
		var lineFlux = 120;
		var dotRadiusDecay = 0.2;

		setup();
		mouseDownEvent({button: 2});

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
					speed: genColors.get.randomNumber(0.01, 0.03, 4) * (Math.random() > 0.5 ? 1 : -1),
					orbit: genColors.get.randomNumber(0,100,4)
				});
			}
		}

		function mouseDownEvent(e, state) {
			if (e.button === 2) {
				color1 = genColors.random.rgba();
				color2 = genColors.random.rgba();
				lineColor = genColors.random.hex();
				outlineColor = genColors.random.hex();
			}
			for (var i = 0; i < clusters.length; i++) {
				for (var x = 0; x < clusters[i].dots.length; x++) {
					clusters[i].dots[x].color = genColors.randomBetween.rgba(
						color1,
						color2
					)
				}
			}
		}

		function newRingDot () {
			return {
				r: genColors.get.randomNumber(2,10),
				speed: genColors.get.randomNumber(0.03,0.08) * (Math.random() > 0.5 ? 1 : -1),
				orbit: genColors.get.randomNumber(0,10),
				angle: 0,
				color: genColors.randomBetween.rgba(
					color1,
					color2
				)
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			ctx.strokeStyle = outlineColor;
			ctx.lineWidth = 1;

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
					dot.r -= dotRadiusDecay;
					dot.angle += dot.speed;

					if (dot.r < 0) {
						cluster.dots[ii] = newRingDot();
					}
					else {
						ctx.beginPath();
						ctx.fillStyle = dot.color;
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

			for (var a = 0; a < clusters.length; a++) {
				var cluster1 = clusters[a];
				for (var b = a; b < clusters.length; b++) {
					var cluster2 = clusters[b];
					var d = Math.sqrt(Math.pow(cluster1.xD - cluster2.xD, 2) + Math.pow(cluster1.yD - cluster2.yD, 2));
					if (d < lineFlux) {
						ctx.beginPath();
						ctx.strokeStyle = lineColor;
						ctx.lineWidth = d / lineFlux;
						ctx.moveTo(cluster1.xD, cluster1.yD);
						ctx.lineTo(cluster2.xD, cluster2.yD);
						ctx.stroke();
						ctx.closePath();
					}
				}
			}
		}
	}
})();