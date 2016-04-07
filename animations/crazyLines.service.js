(function () {
	'use strict';
	angular
		.module('animations')
		.factory('crazyLines', crazyLines);

	crazyLines.$inject = ['genColors'];

	function crazyLines(genColors) {

		var service = {
			draw: draw
		};

		var rows = 100;
		var columns = 160;
		var flux = 20;
		var spd = 3;
		var reduxSpd = 7;
		var reduxSpd2 = reduxSpd * 8;
		var points = [];

		return service;

		////////////////////////////////////////////////

		function newPoint() {
			var x = genColors.get.randomNumber(-flux, flux);
			var y = genColors.get.randomNumber(-flux, flux);
			return {
				x: x,
				y: y,
				xO: x,
				yO: y,
				xD: genColors.get.randomNumber(spd/2, spd) * (Math.random() > 0.5 ? 1 : -1) ,
				yD: genColors.get.randomNumber(spd/2, spd) * (Math.random() > 0.5 ? 1 : -1)
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			for (var y = 0; y < rows; y++) {
				if (angular.isUndefined(points[y])) {points.push([]);}
				for (var x = 0; x < columns; x++) {
					if (angular.isUndefined(points[y][x])) {
						points[y].push(newPoint());
					}
					var p = points[y][x];
					var absXD = Math.abs(p.xD);
					var absYD = Math.abs(p.yD);

					p.x += p.xD;
					p.y += p.yD;

					// animation for collapsing lines to mouse position when held down
					if (state.mouseDown) {
						var xPos = state.w / (columns-1) * x + p.x;
						var yPos = state.h / (rows-1) * y + p.y;
						if (xPos < state.mouseX) {p.x += reduxSpd2}
						if (xPos > state.mouseX) {p.x -= reduxSpd2}
						if (yPos < state.mouseY) {p.y += reduxSpd2}
						if (yPos > state.mouseY) {p.y -= reduxSpd2}
					}

					// toggle direction and fast decrease when oversized
					if (p.x > p.xO + flux) {p.xD = absXD * -1;  if(!state.mouseDown && p.x - p.xO - flux > reduxSpd){p.x -= reduxSpd;}}
					if (p.x < p.xO - flux) {p.xD = absXD;       if(!state.mouseDown && p.xO - flux - p.x > reduxSpd){p.x += reduxSpd;}}
					if (p.y > p.yO + flux) {p.yD = absYD * -1;  if(!state.mouseDown && p.y - p.yO - flux > reduxSpd){p.y -= reduxSpd;}}
					if (p.y < p.yO - flux) {p.yD = absYD;       if(!state.mouseDown && p.yO - flux - p.y > reduxSpd){p.y += reduxSpd;}}
				}
			}

			for (y = 0; y < rows-1; y++) {
				for (x = 0; x < columns-1; x++) {
					var p1 = points[y  ][x  ];
					var p2 = points[y  ][x+1];
					var p3 = points[y+1][x+1];
					var xA = state.w / (columns-1);
					var yA = state.h / (rows-1);

					ctx.beginPath();
					ctx.strokeStyle = 'rgba(255,255,255,0.4)';
					ctx.moveTo(xA * x + p1.x,       yA * y + p1.y);
					ctx.lineTo(xA * (x + 1) + p2.x, yA * y + p2.y);
					ctx.lineTo(xA * (x + 1) + p3.x, yA * (y + 1) + p3.y);
					ctx.stroke();
					ctx.closePath();
				}
			}
		}

	}
})();