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

		var lines = [];
		var totalPoints = 40;
		var numLines = 60;
		var numLinesNoColor = 40;
		var initialized = false;
		var flux = 30;
		var fluxGrowth = 3;
		var overallSpeed = 4;
		var mouseHeightImpact = 3;
		var mouseSpeedImpact = 2;

		return service;

		////////////////////////////////////////////////

		function initialize(state) {
			var spacing = state.w / totalPoints;
			for (var x = 0; x < numLines; x++) {
				lines.push({
					points: [],
					flux: flux + ((numLines-x)*fluxGrowth)
				});
				for (var i = 0; i <= totalPoints+1; i++) {
					lines[x].points.push({
						x: i * spacing,
						y: 0,
						f: genColors.get.randomNumber(-flux + 2, flux - 2, 0),
						speed: genColors.get.randomNumber(0.1, 1) * (Math.random()<.5 ? 1 : -1)
					});
				}
			}
			initialized = true;
			mouseDownEvent({button:2});
		}

		function mouseDownEvent(e, state) {
			if (e.button === 2) {
				var colors = genColors.array.hex(
					genColors.random.hex(),
					genColors.random.hex(),
					lines.length - numLinesNoColor
				);
				for (var x = 0; x < lines.length - numLinesNoColor; x++) {
					lines[x].c = colors[x];
				}
			}
		}

		function draw(ctx, state) {
			if (!initialized) { service.initialize(state);}

			// draw lines in color
			for (x = 0; x < lines.length - numLinesNoColor; x++) {
				var line = lines[x];
				ctx.strokeStyle = line.c;
				ctx.beginPath();
				ctx.moveTo(line.points[0].x, line.points[0].y);
				for (i = 0; i < line.points.length-1; i++) {
					var p1 = line.points[i];
					var p2 = line.points[i+1];
					var xc = (p1.x + p2.x) / 2;
					var yc = (p1.y + p2.y) / 2;
					ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
				}
				ctx.stroke();
				ctx.closePath();
			}

			// make point adjustments
			for (var x = 0; x < lines.length; x++) {
				line = lines[x];
				for (var i = 0; i < line.points.length; i++) {
					p1 = line.points[i];
					p2 = line.points[i+1];

					var fluxAtMouse = state.mouseX < p1.x || state.mouseX > p2.x;
					var flux = fluxAtMouse ? line.flux : line.flux * mouseHeightImpact;

					if ((p1.f >  flux && p1.speed > 0) ||
						(p1.f < -flux && p1.speed < 0)) {
						p1.speed *= -1;
					}

					p1.f += (p1.speed * overallSpeed) * (fluxAtMouse ? 1 : mouseSpeedImpact);
					p1.y = state.h/2 + p1.f;
				}
			}

			//partial erase
			var oldArray = ctx.getImageData(0,0,state.w,state.h);
			for(var d=3;d<oldArray.data.length;d+=4){ //count through only the alpha pixels
				//dim it with some feedback, I'm using .9
				oldArray.data[d] = Math.floor(oldArray.data[d]*.93);
			}
			ctx.putImageData(oldArray,0,0);

			// draw lines in white
			for (x = 0; x < lines.length; x++) {
				line = lines[x];
				ctx.strokeStyle = '#FFFFFF';
				ctx.beginPath();

				ctx.moveTo(line.points[0].x, line.points[0].y);
				for (i = 0; i < line.points.length-1; i++) {
					p1 = line.points[i];
					p2 = line.points[i+1];
					xc = (p1.x + p2.x) / 2;
					yc = (p1.y + p2.y) / 2;
					ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
				}
				ctx.stroke();
				ctx.closePath();
			}
		}
	}
})();