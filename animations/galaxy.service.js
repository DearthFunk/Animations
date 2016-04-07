(function () {
	'use strict';
	angular
		.module('animations')
		.factory('galaxy', galaxy);

	galaxy.inject = ['genColors'];

	function galaxy(genColors) {

		var service = {
			mouseDownEvent: mouseDownEvent,
			draw: draw
		};

		var galaxyTotalStars = 1500;
		var galaxyBursts = [];
		var galaxyStars = [];
		var galaxyMagnifyingGlass = 120;

		for (var i = 0; i < galaxyTotalStars; i++) {
			galaxyStars.push({
				x: 0,
				y: 0,
				size: genColors.get.randomNumber(0.01,1),
				angle: 0,
				speed: Math.random(),
				targetSize: 1,
				orbit: Math.random()
			});
		}

		return service;

		///////////////////////////////////////

		function mouseDownEvent(e, state) {
			galaxyBursts.push({
				r:0,
				x: state.mouseX,
				y: state.mouseY,
				speed: genColors.get.randomNumber(5,10)
			});
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			for (i =0; i < galaxyBursts.length; i++) {
				var burst = galaxyBursts[i];
				burst.r += burst.speed;
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.strokeStyle = genColors.convert.rgba('#FFFFFF',1-(burst.r/state.mainRadius));
				ctx.fillStyle = 'rgba(255,0,0,0.03)';
				ctx.arc(burst.x,burst.y, burst.r, 0, Math.PI*2, true);
				ctx.stroke();
				ctx.fill();
				ctx.closePath();
			}
			for (i =0; i < galaxyBursts.length; i++) {
				if (galaxyBursts[i].r > state.mainRadius + 40) {galaxyBursts.splice(i,1)}
			}
			var magnifySize = galaxyMagnifyingGlass + (galaxyBursts.length*6);
			for (var i = 0; i < galaxyStars.length; i++) {
				var spin = galaxyStars[i];
				var orbit = 1 + (state.mainRadius * spin.orbit);
				spin.angle += (spin.speed / 100) * (state.mouseHovering ? -1 : 1);
				spin.x = state.xCenter + Math.cos(i + spin.angle) * orbit;
				spin.y = state.yCenter + Math.sin(i + spin.angle) * orbit;

				var d = Math.sqrt( Math.pow(spin.x - state.mouseX, 2) + Math.pow(spin.y - state.mouseY, 2) );
				var r = !(d > magnifySize);

				ctx.beginPath();
				ctx.fillStyle = genColors.convert.rgba('#FFFFFF',1-spin.orbit+0.5);
				ctx.arc(spin.x, spin.y, r ? spin.size * (magnifySize-d) * 0.1 : spin.size, 0, Math.PI*2, true);
				ctx.fill();
				ctx.closePath();
			}
		}
	}
})();