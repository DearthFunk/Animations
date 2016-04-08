(function () {
	'use strict';
	angular
		.module('animations')
		.factory('clover', clover);

	clover.$inject = ['genColors'];

	function clover(genColors) {

		var service = {
			draw: draw,
			mouseDownEvent: mouseDownEvent
		};
		var mainRadius = 150;
		var dotSize = 5;
		var numDots = 55;
		var angle = 0;
		var speed = 0.0006;
		var clrs = [];
		var deadRange = 0.3;
		var deadZones = 4;

		//http://i.imgur.com/VlsPlbU.gif
		service.mouseDownEvent({which:3});

		return service;

		//////////////////////////////////////////////////

		function mouseDownEvent(e, state) {
			if (e.which === 3) {
				clrs = [];
				var clr1 = genColors.random.hex();
				var clr2 = genColors.random.hex();
				for (var i = 0; i < numDots; i++) {
					clrs.push(genColors.randomBetween.rgba(clr1, clr2, 1, 1))
				}
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			for (var i = 0; i < numDots; i++) {
				angle += speed;
				angle = angle % (Math.PI*2);
				var rad = i/numDots * 2 * Math.PI;// + angle;
				var mRad = mainRadius;
				var inDeadZone = false;

				for (var x = 0; x < deadZones; x++) {
					var dzAngle = ((Math.PI*2/deadZones*x) + angle) %(Math.PI*2);
					if (dzAngle > rad-deadRange && dzAngle < rad+deadRange) {
						ctx.fillStyle = '#FFFFFF';
						inDeadZone = true;
					}
				}

				if(!inDeadZone) {
					ctx.fillStyle = clrs[i];
				}

				var x = mRad * Math.cos(rad) + state.xCenter;
				var y = mRad * Math.sin(rad) + state.yCenter;

				ctx.beginPath();
				ctx.arc(x, y, dotSize, 0, Math.PI*2, true);
				ctx.fill();
				ctx.closePath();

			}
		}
	}
})();