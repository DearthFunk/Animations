(function () {
	'use strict';
	angular
		.module('animations')
		.factory('clover', clover);

	clover.$inject = ['genColors'];

	function clover(genColors) {

		var service = {
			draw: draw
		};
		var mainRadius = 150;
		var dotSize = 10;
		var numDots = 30;
		var angle = 0;
		var speed = 0.0001;
		var clrs = genColors.array.hex('#FF0000', '#0000FF', numDots);
		var range = 0.2;

		//http://i.imgur.com/VlsPlbU.gif

		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {

			for (var i = 0; i < numDots; i++) {
				angle += speed;
				angle = angle % (Math.PI*2);
				var rad = i/numDots * 2 * Math.PI;// + angle;

				if (angle > rad-range && angle < rad+range) {
					ctx.fillStyle = '#000000';
				}
				else {
					ctx.fillStyle = clrs[i];
				}
				ctx.strokeStyle = '#FFFFFF';
				var mRad = mainRadius;

				var x = mRad * Math.cos(rad) + state.xCenter;
				var y = mRad * Math.sin(rad) + state.yCenter;



				ctx.beginPath();
				ctx.arc(x, y, dotSize, 0, Math.PI*2, true);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();

			}
		}
	}
})();