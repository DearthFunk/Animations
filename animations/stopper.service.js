(function () {
	'use strict';
	angular
		.module('animations')
		.factory('stopper', stopper);

	stopper.$inject = ['genColors'];

	function stopper(genColors) {

		var service = {
			draw: draw,
			mouseDownEvent: mouseDownEvent
		};

		var stopperLines = [];
		var stopperSizeMin = 20;
		var stopperTotal = 1000;
		var stopperSize = stopperSizeMin;

		for (var i = 0; i < stopperTotal; i ++) {
			var length = Math.random();
			stopperLines.push({
				c: genColors.random.rgba(0,false,1-length),
				angle: Math.random() * Math.PI*2,
				speed: genColors.get.randomNumber(0.01, 0.015) ,
				length: length,
				hitCircle: false
			})
		}

		return service;

		/////////////////////////////////////////////

		function mouseDownEvent(e, state) {
			if (stopperSize < state.mainRadius/2){
				stopperSize += 9;
			}
		}
		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			if (!state.mouseDown && stopperSize > stopperSizeMin) {stopperSize-= 0.6;}
			if (stopperSize < 0) {stopperSize = 0;}

			for (i = 0; i < stopperLines.length; i++) {
				var line = stopperLines[i];
				var x = state.xCenter + Math.cos(line.angle) * line.length * state.mainRadius;
				var y = state.yCenter + Math.sin(line.angle) * line.length * state.mainRadius;

				if (Math.sqrt( Math.pow(state.mouseX - x, 2) + Math.pow(state.mouseY - y, 2) ) > stopperSize+2) {
					line.angle += line.speed;
				}

				ctx.beginPath();
				ctx.moveTo(state.xCenter,state.yCenter);
				ctx.lineTo(x,y);
				ctx.strokeStyle = line.c;
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.fillStyle = '#FFFF00';
				ctx.arc(x,y,1.2,0,Math.PI*2,false);
				ctx.fill();
				ctx.closePath();
			}

			ctx.beginPath();
			ctx.arc(state.mouseX,state.mouseY,stopperSize,0,Math.PI*2,false);
			ctx.strokeStyle = '#FFFFFF';
			ctx.fillStyle = 'rgba(0,0,0,0.4)';
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
		}
	}
})();


