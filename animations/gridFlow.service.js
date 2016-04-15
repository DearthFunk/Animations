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
		var gridColor = '#444444';
		var gridThickness = 0.7;
		var grid = [];

		return service;

		//////////////////////////////////////////////////

		function windowResizeEvent(e, state) {
			grid = [];
			cellsWide = Math.floor(state.w / cellSize) + 1;
			cellsHigh = Math.floor(state.h / cellSize) + 1;
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
			ctx.clearRect(0, 0, state.w, state.h);
			ctx.lineWidth = gridThickness;
			ctx.strokeStyle = gridColor;
			for (var y = 0; y < cellsHigh; y++) {
				for (var x = 0; x < cellsWide; x++) {
					var p1 = grid[y][x];
					var p2 = grid[y + 1][x + 1];
					ctx.beginPath();
					ctx.moveTo(p1.x, p1.y);
					ctx.lineTo(p2.x, p1.y);
					ctx.lineTo(p2.x, p2.y);
					ctx.lineTo(p1.x, p2.y);
					ctx.lineTo(p1.x, p1.y);
					ctx.stroke();
					ctx.closePath();
				}
			}
		}
	}
})();