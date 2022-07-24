(function () {
	'use strict';
	angular
		.module('animations')
		.factory('ring', ring);

	ring.$inject = ['genColors'];

	function ring(genColors) {

		var service = {
			draw: draw
		};

		var ringClusterAngle = 0;
		var ringDots = [];
		var ringTotalDots = 30;
		var ringTotalClusters = 30;

		return service;

		/////////////////////////////////////////

		function newRingDot () {
			return {
				r: genColors.get.randomNumber(2,10),
				speed: genColors.get.randomNumber(0,0.04),
				orbit: Math.random()*10,
				angle: 0
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			ctx.fillStyle = '#FFFFFF';
			ctx.strokeStyle = '#FF0000';
			ringClusterAngle += state.mouseDistanceFromCenter/20000;

			for (var cluster = 0; cluster < ringTotalClusters; cluster++) {
				var clusterA = cluster/ringTotalClusters * 2 * Math.PI;
				var clusterX = (state.mainRadius*2/3) * Math.cos(clusterA + (cluster%2==0?ringClusterAngle:-1*ringClusterAngle)) + state.xCenter;
				var clusterY =  (state.mainRadius*2/3) * Math.sin(clusterA + (cluster%2==0?ringClusterAngle:-1*ringClusterAngle)) + state.yCenter;

				if (ringDots[cluster] == undefined) {
					ringDots.push([]);
				}
				for (var i = 0; i < ringTotalDots; i++) {
					if (angular.isUndefined(ringDots[cluster][i])) {
						ringDots[cluster].push(newRingDot());
					}

					var dot = ringDots[cluster][i];
					dot.r -= 5/state.mouseDistanceFromCenter;
					dot.angle += dot.speed;

					if (dot.r < 0) {
						ringDots[cluster][i] = newRingDot();
					}
					else {
						ctx.beginPath();
						ctx.arc(
							clusterX + Math.cos(i + dot.angle) * dot.orbit * dot.angle * 4.5,
							clusterY + Math.sin(i + dot.angle) * dot.orbit * dot.angle * 4.5,
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