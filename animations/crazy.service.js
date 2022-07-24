(function () {
	'use strict';
	angular
		.module('animations')
		.factory('crazy', crazy);

	crazy.$inject = ['genColors'];

	function crazy(genColors) {

		var service = {
			draw: draw,
			mouseDownEvent: mouseDownEvent
		};

		var rows = 30;
		var columns = 40;
		var flux = 60;
		var spd = 3;
		var lastMouseX = -1;
		var lastMouseY = -1;
		var reduxSpd = 12;
		var points = [];
		var xArray = [];
		var yArray = [];

		return service;

		////////////////////////////////////////////////

		function newPoint(c1, c2) {
			var x = genColors.get.randomNumber(-flux, flux);
			var y = genColors.get.randomNumber(-flux, flux);
			return {
				x: x,
				y: y,
				xO: x,
				yO: y,
				xD: genColors.get.randomNumber(spd/2, spd) * (Math.random() > 0.5 ? 1 : -1) ,
				yD: genColors.get.randomNumber(spd/2, spd) * (Math.random() > 0.5 ? 1 : -1) ,
				c: genColors.randomBetween.rgba(c1, c2, 0.2, 0.3),
				hovering: false
			}
		}
		function pointInPolygon( vertx, verty, testx, testy ) {
			var i, j, c = false;
			for( i = 0, j = vertx.length-1; i < vertx.length; j = i++ ) {
				if( ( ( verty[i] > testy ) != ( verty[j] > testy ) ) &&
					( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
					c = !c;
				}
			}
			return c;
		}

		function mouseDownEvent(e, state) {
			if (e.which === 3) {
				points = [];
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var c1 = false;
			var c2 = false;
			for (var y = 0; y < rows; y++) {
				if (angular.isUndefined(points[y])) {points.push([]);}
				for (var x = 0; x < columns; x++) {
					if (angular.isUndefined(points[y][x])) {
						if(!c1) {
							c1 = genColors.random.hex();
							c2 = genColors.random.hex();
						}
						points[y].push(newPoint(c1, c2));
					}
					var p = points[y][x];
					var absXD = Math.abs(p.xD);
					var absYD = Math.abs(p.yD);

					// actual adjust of point position
					if (lastMouseX !== -1) {
						p.x += p.xD + (p.hovering && state.mouseDown ? (state.mouseX - lastMouseX) : 0);
						p.y += p.yD + (p.hovering && state.mouseDown ? (state.mouseY - lastMouseY) : 0);
					}

					// toggle direction and fast decrease when oversized
					if (p.x > p.xO + flux) {p.xD = absXD * -1;  if(!state.mouseDown && p.x - p.xO - flux > reduxSpd){p.x -= reduxSpd;}}
					if (p.x < p.xO - flux) {p.xD = absXD;       if(!state.mouseDown && p.xO - flux - p.x > reduxSpd){p.x += reduxSpd;}}
					if (p.y > p.yO + flux) {p.yD = absYD * -1;  if(!state.mouseDown && p.y - p.yO - flux > reduxSpd){p.y -= reduxSpd;}}
					if (p.y < p.yO - flux) {p.yD = absYD;       if(!state.mouseDown && p.yO - flux - p.y > reduxSpd){p.y += reduxSpd;}}
				}
			}
			lastMouseX = state.mouseX;
			lastMouseY = state.mouseY;

			for (y = 0; y < rows-1; y++) {
				for (x = 0; x < columns-1; x++) {
					var p1 = points[y  ][x  ];
					var p2 = points[y  ][x+1];
					var p3 = points[y+1][x+1];
					var p4 = points[y+1][x  ];
					var xA = state.w / (columns-1);
					var yA = state.h / (rows-1);
					xArray = [
						xA * x + p1.x,
						xA * (x + 1) + p2.x,
						xA * (x + 1) + p3.x,
						xA * x + p4.x
					];
					yArray = [
						yA * y + p1.y,
						yA * y + p2.y,
						yA * (y + 1) + p3.y,
						yA * (y + 1) + p4.y
					];
					points[y][x].hovering = pointInPolygon(xArray, yArray, state.mouseX, state.mouseY);

					ctx.beginPath();
					ctx.strokeStyle = 'rgba(0,0,0,0.5)';
					ctx.fillStyle = p1.c;

					ctx.moveTo(xArray[0], yArray[0]);
					ctx.lineTo(xArray[1], yArray[1]);
					ctx.lineTo(xArray[2], yArray[2]);
					ctx.lineTo(xArray[3], yArray[3]);
					ctx.lineTo(xArray[0], yArray[0]);

					ctx.stroke();
					ctx.fill();
					ctx.closePath();
				}
			}
		}

	}
})();