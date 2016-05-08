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
		var totalPoints = 20;
		var numLines = 15;
		var initialized = false;
		var flux = 70;
		var overallSpeed = 2;
		return service;

		////////////////////////////////////////////////

		function initialize(state) {

			var spacing = state.w / totalPoints;
			for (var x = 0; x < numLines; x++) {
				lines.push({
					points: []
				});
				for (var i = 0; i < totalPoints+1; i++) {
					lines[x].points.push({
						x: i * spacing,
						y: 0,
						f: genColors.get.randomNumber(-flux + 2, flux - 2, 0),
						speed: genColors.get.randomNumber(0.1, 1)
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
					lines.length
				);
				console.log(colors);
				for (var x = 0; x < lines.length; x++) {
					lines[x].c = colors[x];
				}
			}
		}

		function draw(ctx, state) {
			if (!initialized) { service.initialize(state);}

			//partial erase
			var oldArray = ctx.getImageData(0,0,state.w,state.h);
			for(var d=3;d<oldArray.data.length;d+=4){ //count through only the alpha pixels
				//dim it with some feedback, I'm using .9
				oldArray.data[d] = Math.floor(oldArray.data[d]*.9);
			}
			ctx.putImageData(oldArray,0,0);

			// make point adjustments
			for (var x = 0; x < lines.length; x++) {
				for (var i = 0; i < lines[x].points.length; i++) {
					var p = lines[x].points[i];
					if (p.f > flux || p.f < -flux) {
						p.speed *= -1;
					}
					p.f += (p.speed * overallSpeed);
					p.y = state.h/2 + p.f;
				}
			}

			// draw lines
			for (x = 0; x < lines.length; x++) {
				var line = lines[x];
				ctx.strokeStyle = line.c;
				ctx.beginPath();

				ctx.moveTo(line.points[0].x, line.points[0].y);
				for (i = 1; i < line.points.length-1; i++) {
					var p1 = line.points[i];
					var p2 = line.points[i+1];
					var xc = (p1.x + p2.x) / 2;
					var yc = (p1.y + p2.y) / 2;
					ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
				}
				ctx.stroke();
				ctx.closePath();
			}
		}
	}
})();