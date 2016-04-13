(function () {
	'use strict';
	angular
		.module('animations')
		.factory('triangles', triangles);

	triangles.$inject = ['genColors'];

	function triangles(genColors) {

		var service = {
			draw: draw,
			drawTriangle: drawTriangle
		};
		var layers = 12;
		var size = 100;
		var numW = 10;
		var numH = 10;
		var rotation = 0;
		var speed = 0.001;

		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			rotation += speed;
			var rectX = numW * size /2;
			var rectY = numH * size /2;

			for (var i = 0; i < layers; i++) {
				ctx.save();
				ctx.fillStyle = genColors.convert.rgba('#111111', i/layers);
				ctx.translate(state.xCenter, state.yCenter);
				ctx.rotate(rotation * i * (i%2 === 0 ? 1 : -1));
				ctx.translate(-state.xCenter, -state.yCenter);

				for ( var x = 0; x < numH; x++) {
					var xPos = (x * size) + state.xCenter - rectX;
					for ( var y = 0; y < numW; y++) {
						var yPos = (y * size)+ state.yCenter - rectY;
						ctx.beginPath();
						ctx.moveTo(xPos, yPos);
						ctx.lineTo(xPos - (size/2), yPos + size);
						ctx.lineTo(xPos + (size/2), yPos + size);
						ctx.lineTo(xPos, yPos);
						ctx.fill();
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