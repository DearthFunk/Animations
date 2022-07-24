(function () {
	'use strict';
	angular
		.module('animations')
		.service('tracer', tracer);

	tracer.$inject = ['genColors'];

	function tracer(genColors) {

		var service = {
			draw: draw,
			mouseDownEvent: mouseDownEvent,
			mouseMoveEvent: mouseMoveEvent
		};
		var tracerMaxLength = 30;
		var tracerHoverPoints = [];
		var tracerColors = [];
		var tracerMaxPointsPerLine = 200;
		var tracerCircleAddSpacing = 0;

		return service;

		///////////////////////////////////////////////

		function mouseDownEvent(e, state) {
			tracerHoverPoints = [];
		}

		function mouseMoveEvent(e, state) {
			if (tracerHoverPoints.length >= tracerMaxLength) {
				tracerHoverPoints.splice(0,1);
			}
			for (var i = 1; i < 2; i++) {
				tracerHoverPoints.push({
					x:e.clientX,
					y:e.clientY,
					p:[]}
				);
			}
			tracerColors = genColors.array.rgba('#FF0000','#0000FF',tracerHoverPoints.length,1,1);
		}


		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var spacing = state.h / 40;
			tracerCircleAddSpacing += state.mouseDown ? -0.3 : 0.3;
			if (tracerCircleAddSpacing > spacing) {tracerCircleAddSpacing = 0}
			if (tracerCircleAddSpacing < 0) {tracerCircleAddSpacing = spacing}
			var numCircles = Math.floor(state.h/spacing);
			for (i = 0; i < numCircles; i++) {
				ctx.beginPath();
				ctx.arc(state.xCenter,state.yCenter,i*spacing + tracerCircleAddSpacing,0,Math.PI*2,false);
				ctx.strokeStyle = genColors.convert.rgba('#FFFF00',1-(i*spacing)/state.h);
				ctx.stroke();
				ctx.closePath();
			}

			if (tracerHoverPoints.length > 0){
				for (var i = 0; i <  tracerHoverPoints.length-1; i++) {
					var point = tracerHoverPoints[i];
					var point2 = tracerHoverPoints[i+1];
					if (state.mouseDown) {
						ctx.beginPath();
						ctx.moveTo(point.x, point.y);
						ctx.lineTo(point2.x,point2.y);

						ctx.strokeStyle = tracerColors[i];
						ctx.stroke();
						ctx.closePath();
					}

					if (point.p.length < tracerMaxPointsPerLine && state.mouseDown) {
						point.p.push({
							r:genColors.get.randomNumber(3,5),
							x:point.x,
							y:point.y,
							xD: genColors.get.randomNumber(-2,2),
							yD: genColors.get.randomNumber(-2,2),
							rD: genColors.get.randomNumber(0.1,0.4)
						});
					}

					for (var a = 0; a < point.p.length; a++){
						var dot = point.p[a];
						dot.x += dot.xD;
						dot.y += dot.yD;
						dot.r -= dot.rD;
						if (dot.r < 0) {point.p.splice(a,1)}
						else {
							ctx.beginPath();
							ctx.arc(dot.x,dot.y,dot.r,0,Math.PI*2,false);
							ctx.fillStyle = '#FFFFFF';
							ctx.fill();
							ctx.strokeStyle = tracerColors[i];
							ctx.stroke();
							ctx.closePath();
						}
					}
				}
			}
		}
	}
})();