(function () {
	'use strict';
	angular
		.module('animations')
		.factory('squares', squares);

	squares.$inject = ['genColors', '$rootScope'];

	function squares(genColors, $rootScope) {

		var service = {
			draw: draw,
			keyDownEvent: keyDownEvent,
			rotations: [true, false, false, false, true, false, false, false]
		};

		var squaresTotal = 10;
		var squaresLevels = 12;
		var rotate = 0;
		var point1 ={x:-1,y:-1};
		var point2 ={x:-1,y:-1};
		var point3 ={x:-1,y:-1};
		var point4 ={x:-1,y:-1};
		var squaresHoverRadiusAdjust = 2;
		var squaresLevelColors = genColors.array.rgba('#FF0000','#494949',squaresLevels,1,0.4);
		var squares = [];

		for (var i = 0; i < squaresTotal; i++) {
			squares.push({
				x: -1,
				y: -1,
				angle: 0
			});
		}

		return service;

		/////////////////////////////////////////////

		function keyDownEvent(e) {
			var index = e - 49; //1 through 8 on keyboard
			if (index > -1 && index < service.rotations.length) {
				service.rotations[index] = !service.rotations[index];
				$rootScope.$apply();
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			rotate+= 0.1;
			for (var lvl = 1; lvl < squaresLevels+1; lvl++ ) {
				ctx.strokeStyle = lvl == squaresLevels ? 'rgba(255,100,100,0.2)' : squaresLevelColors[lvl];
				var growth = Math.pow(lvl * 1.5,2);
				for ( var squareNum = 0; squareNum < squaresTotal; squareNum++) {
					var square = squares[squareNum];
					square.angle += state.mouseDistanceFromCenter / 500000;
					var squareAngle = square.angle*(lvl%2==0?-1:1);

					point1.x = state.xCenter + Math.cos(squareNum + (squareAngle *(service.rotations[0] ? squaresHoverRadiusAdjust : 1) + (1/2*Math.PI) )) * growth;
					point1.y = state.yCenter + Math.sin(squareNum + (squareAngle *(service.rotations[1] ? squaresHoverRadiusAdjust : 1) + (1/2*Math.PI) )) * growth;
					point2.x = state.xCenter + Math.cos(squareNum + (squareAngle *(service.rotations[2] ? squaresHoverRadiusAdjust : 1) + (2/2*Math.PI) )) * growth;
					point2.y = state.yCenter + Math.sin(squareNum + (squareAngle *(service.rotations[3] ? squaresHoverRadiusAdjust : 1) + (2/2*Math.PI) )) * growth;
					point3.x = state.xCenter + Math.cos(squareNum + (squareAngle *(service.rotations[4] ? squaresHoverRadiusAdjust : 1) + (3/2*Math.PI) )) * growth;
					point3.y = state.yCenter + Math.sin(squareNum + (squareAngle *(service.rotations[5] ? squaresHoverRadiusAdjust : 1) + (3/2*Math.PI) )) * growth;
					point4.x = state.xCenter + Math.cos(squareNum + (squareAngle *(service.rotations[6] ? squaresHoverRadiusAdjust : 1) + (4/2*Math.PI) )) * growth;
					point4.y = state.yCenter + Math.sin(squareNum + (squareAngle *(service.rotations[7] ? squaresHoverRadiusAdjust : 1) + (4/2*Math.PI) )) * growth;

					ctx.beginPath();
					ctx.moveTo(point1.x, point1.y);
					ctx.lineTo(point2.x, point2.y);
					ctx.lineTo(point3.x, point3.y);
					ctx.lineTo(point4.x, point4.y);
					ctx.lineTo(point1.x, point1.y);
					ctx.stroke();
					ctx.closePath();
				}
			}
		}
	}
})();


