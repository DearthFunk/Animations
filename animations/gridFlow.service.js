(function () {
	'use strict';
	angular
		.module('animations')
		.factory('gridFlow', gridFlow);

	gridFlow.$inject = [];

	function gridFlow() {

		var service = {
			draw: draw,
			windowResizeEvent: windowResizeEvent
		};

		var cellSize = 60;
		var cellsWide = 0;
		var cellsHigh = 0;
		var cellsWideHalf = 0;
		var cellsHighHalf = 0;
		var gridColor = '#444444';
		var gridThickness = 0.7;
		var impact = 1;
		var impactSpeed = 0.1;
		var maxImpact = 30;
		var grid = [];

		return service;

		//////////////////////////////////////////////////

		function windowResizeEvent(e, state) {
			grid = [];
			cellsWide = Math.floor(state.w / cellSize) + 1;
			cellsHigh = Math.floor(state.h / cellSize) + 1;
			cellsWideHalf = Math.floor(cellsWide/2);
			cellsHighHalf = Math.floor(cellsHigh/2);
			for (var y = 0; y < cellsHigh+1; y++) {
				grid.push([]);
				for (var x = 0; x < cellsWide+1; x++) {
					grid[y].push({
						x: x * cellSize,
						y: y * cellSize
					})
				}
			}
		}

		function draw(ctx, state) {
			//ctx.clearRect(0, 0, state.w, state.h);
			//partial erase
			var oldArray = ctx.getImageData(0,0,state.w,state.h);
			for(var d=3;d<oldArray.data.length;d+=4){ //count through only the alpha pixels
				//dim it with some feedback, I'm using .9
				oldArray.data[d] = Math.floor(oldArray.data[d]*.4);
			}
			ctx.putImageData(oldArray,0,0);

			impact += impactSpeed;
			if (impact > maxImpact || impact < 1) {
				impactSpeed *= -1
			}

			ctx.lineWidth = gridThickness;
			ctx.strokeStyle = gridColor;
			var xD = (state.xCenter - state.mouseX) * impact;
			var yD = (state.yCenter - state.mouseY) * impact;
			for (var y = 0; y < cellsHigh; y++) {
				for (var x = 0; x < cellsWide; x++) {
					var p1 = grid[y][x];
					var p2 = grid[y + 1][x + 1];
					drawCurves(ctx, x, y, xD, yD, p1, p2);
				}
			}
		}

		function drawCurves(ctx, x, y, xD, yD, p1, p2) {
			//var xDD = 1; //xD * (x - cellsWideHalf) / cellsWideHalf;
			//var yDD = 1; //yD * (y - cellsHighHalf) / cellsHighHalf;
			xD /= 10;
			yD /= 10;
			ctx.strokeStyle = '#FFFFFF';
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.bezierCurveTo(p2.x + xD, p1.y + yD, p1.x + xD, p2.y + yD, p2.x, p2.y);
			ctx.stroke();
			ctx.closePath();

			ctx.strokeStyle = '#FFFFFF';
			ctx.beginPath();
			ctx.moveTo(p1.x, p2.y);
			ctx.bezierCurveTo(p2.x + xD, p2.y + yD, p1.x + xD, p1.y + yD, p2.x, p1.y);
			ctx.stroke();
			ctx.closePath();

		}
	}
})();