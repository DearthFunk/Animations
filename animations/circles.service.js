(function () {
	'use strict';
	angular
		.module('animations')
		.factory('circles', circles);

	circles.$inject = ['genColors'];

	function circles(genColors) {

		var service = {
			draw: draw
		};
		var circleLines = 11;
		var circleDots = 20;
		var circleRotatorMain = 0;
		var circleOuterSpinnerAngle = 0;
		var circleLittleDots = 5;
		var circleRed = '#FF0000';
		var circleBlue = '#0000FF';

		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			circleOuterSpinnerAngle += 0.06;
			var circleHoverAngle = Math.atan2(state.mouseY - state.yCenter, state.mouseX - state.xCenter);
			var circleRotatorX = Math.cos(circleHoverAngle)*state.mainRadius + state.xCenter;
			var circleRotatorY = Math.sin(circleHoverAngle)*state.mainRadius + state.yCenter;
			circleRotatorMain+= state.mouseDistanceFromCenter/100000;

			ctx.beginPath();
			ctx.arc(circleRotatorX,circleRotatorY,state.mouseDistanceFromCenter/4 + 2,0,Math.PI*2, false);
			ctx.lineWidth = 3;
			ctx.strokeStyle = '#000000';
			ctx.stroke();
			ctx.closePath();
			ctx.lineWidth = 1;

			ctx.beginPath();
			ctx.arc(circleRotatorX,circleRotatorY,state.mouseDistanceFromCenter/4,0,Math.PI*2, false);
			ctx.fillStyle = genColors.convert.rgba(circleBlue,0.2);
			ctx.fill();
			ctx.strokeStyle = 'rgba(255,255,255,0.4)';
			ctx.stroke();
			ctx.closePath();


			for (var i = 0; i < circleLittleDots; i++) {
				var angle = i / circleLittleDots * 2 * Math.PI;
				ctx.beginPath();
				ctx.fillStyle = genColors.convert.rgba(circleRed, 0.8);
				ctx.arc(
					circleRotatorX + Math.cos(angle + circleOuterSpinnerAngle) * (state.mouseDistanceFromCenter/4),
					circleRotatorY + Math.sin(angle + circleOuterSpinnerAngle) * (state.mouseDistanceFromCenter/4),
					5,0,Math.PI*2,false);
				ctx.fill();
				ctx.closePath();
			}

			for (var line = 0; line < circleLines; line++) {
				angle = line/circleLines * Math.PI  * 2 - (Math.PI/2);
				for (var dot = 0; dot < circleDots; dot++) {
					var r = dot/circleDots * state.mainRadius;
					var adjustedAngle = angle + (circleRotatorMain * (dot%2==0?1:-1));
					var x = state.xCenter + Math.cos(adjustedAngle) * r;
					var y = state.yCenter + Math.sin(adjustedAngle) * r;
					var d = Math.sqrt(Math.pow(circleRotatorX-x, 2) +	Math.pow(circleRotatorY-y, 2));

					if ((state.mainRadius/2)-(d/4)*(state.mouseDistanceFromCenter/state.mainRadius) > 0) {
						ctx.beginPath();
						var radius = (state.mainRadius/2)-(d/4)*(state.mouseDistanceFromCenter/state.mainRadius);
						ctx.arc(x,y, radius, 0 , Math.PI*2, false);
						if (dot ==0){
							ctx.fillStyle = genColors.convert.rgba(circleRed,0.1);
							ctx.fill();
						}
						ctx.strokeStyle = genColors.convert.rgba('#FFFFFF',1-dot/circleDots);
						ctx.stroke();
						ctx.closePath();
						if (dot == 0) {
							ctx.beginPath();
							ctx.arc(x,y, radius+2, 0 , Math.PI*2, false);
							ctx.lineWidth = 3;
							ctx.strokeStyle = '#000000';
							ctx.stroke();
							ctx.closePath();
							ctx.lineWidth = 1;
							for (i = 0; i < circleLittleDots; i++) {
								var littleAngle = i / circleLittleDots * 2 * Math.PI;
								ctx.beginPath();
								ctx.fillStyle = genColors.convert.rgba(circleBlue,0.8);
								ctx.arc(
									x + Math.cos(littleAngle + circleOuterSpinnerAngle*-1) * radius,
									y + Math.sin(littleAngle + circleOuterSpinnerAngle*-1) * radius,
									5,0,Math.PI*2,false);
								ctx.fill();
								ctx.closePath();
							}
						}
					}
				}
			}
		}
	}
})();