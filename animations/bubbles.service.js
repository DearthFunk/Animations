(function () {
	'use strict';
	angular
		.module('animations')
		.factory('bubbles', bubbles);

	bubbles.$inject = ['genColors'];

	function bubbles(genColors) {

		var service = {
			draw: draw
		};

		var bubbles = [];
		var bubblesTotal = 800;

		for (var i = 0; i < bubblesTotal; i++) {
			bubbles.push( newBubble() );
		}

		return service;

		//////////////////////////////////////////////////

		function newBubble() {
			return {
				position: { x: 0, y: 0 },
				size: genColors.get.randomNumber(0.01,20),
				fillColor: genColors.get.randomNumber(0,1,1) > 0.1 ? genColors.random.rgba(0,true,0.6) : genColors.get.randomNumber(0,1,1) > 0.8 ? '#FFFFFF' : 'rgba(200,50,50,0.5)',
				xMod: genColors.get.randomNumber(-2,2),
				yMod: genColors.get.randomNumber(-2,2),
				speed: genColors.get.roundedNumber(genColors.get.randomNumber(0,1)/100,4),
				orbit: Math.random() * 3,
				angle: 0
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000000';
			for (var i = 0; i < bubbles.length; i++) {
				var bubble = bubbles[i];
				bubble.size -= 4/state.mouseDistanceFromCenter;
				bubble.angle += bubble.speed;

				bubble.position.x += Math.cos(i + bubble.angle) * bubble.orbit * (state.mouseDistanceFromCenter/500);
				bubble.position.y += Math.sin(i + bubble.angle) * bubble.orbit * (state.mouseDistanceFromCenter/500);
				if (bubble.size < 0) { bubbles[i] = newBubble(); }
				if (bubble.size > 0) {
					ctx.beginPath();
					ctx.fillStyle = bubble.fillColor;
					ctx.arc(state.xCenter + bubble.position.x, state.yCenter + bubble.position.y, bubble.size, 0, Math.PI*2, true);
					ctx.fill();
					ctx.closePath();
					ctx.beginPath();
					ctx.moveTo(state.xCenter,state.yCenter);
					ctx.lineTo(state.xCenter + bubble.position.x, state.yCenter + bubble.position.y);
					ctx.strokeStyle = 'rgba(255,255,255,0.05)';
					ctx.stroke();
					ctx.closePath();
				}
			}
		}
	}
})();