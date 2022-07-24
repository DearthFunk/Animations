(function () {
	'use strict';
	angular
		.module('animations')
		.factory('triangles', triangles);

	triangles.$inject = ['genColors'];

	function triangles(genColors) {

		var service = {
			draw: draw,
			drawTriangle: drawTriangle,
			mouseDownEvent: mouseDownEvent
		};
		var colors = [];
		var layers = 10;
		var size = 50;
		var numW = 10;
		var numH = 10;
		var rotation = 0;
		var speed = 0.00001;

		mouseDownEvent({button:2});

		return service;

		//////////////////////////////////////////////////

		function mouseDownEvent(e) {
			if(e.button === 2) {
				colors = genColors.array.rgba(
					genColors.random.hex(),
					genColors.random.hex(),
					layers,
					0, 1
				);
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			rotation += (speed * state.mouseDistanceFromCenter);
			var rectX = numW * size /2;
			var rectY = numH * size /2;

			for (var i = 0; i < layers; i++) {
				ctx.save();
				ctx.fillStyle = colors[i];
				ctx.translate(state.xCenter, state.yCenter);
				ctx.rotate(rotation * i * (i%2 === 0 ? 1 : -1));
				ctx.translate(-state.xCenter, -state.yCenter);

				for ( var x = 0; x < numH; x++) {
					var s = size/x + 10;
					var xPos = (x * size) + state.xCenter - rectX;
					for ( var y = 0; y < numW; y++) {
						var yPos = (y * size)+ state.yCenter - rectY;
						ctx.beginPath();
						ctx.moveTo(xPos, yPos);
						ctx.lineTo(xPos - (s/2), yPos + s);
						ctx.lineTo(xPos + (s/2), yPos + s);
						ctx.lineTo(xPos, yPos);
						ctx.fill();
						ctx.strokeStyle = '#FFFFFF';
						ctx.stroke();
						ctx.closePath();
					}
				}

				ctx.restore();
			}
		}
		function drawTriangle(ctx, x, y) {


		}
	}
})();