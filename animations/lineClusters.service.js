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

		var ringClusterAngle = 0;
		var totalClusters = 30;
		var clusters = [];
		var hPadding = 360;
		var wPadding = 160;

		setup();

		return service;

		///////////////////////////////////////

		function setup() {
			for (var i = 0; i < totalClusters; i++) {
				clusters.push({
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
				ctx.beginPath();
				ctx.arc(cluster.xD, cluster.yD, 5, 0, Math.PI*2, false);
				ctx.stroke();
				ctx.fill();
				ctx.closePath();
				
			}
		}
	}
})();