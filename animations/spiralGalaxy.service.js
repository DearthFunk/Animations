(function () {
	'use strict';
	angular
		.module('animations')
		.factory('spiralGalaxy', spiralGalaxy);

	spiralGalaxy.$inject = ['genColors', 'audioService'];

	function spiralGalaxy(genColors, audioService) {

		var service = {
			draw: draw,
			createSpiralParticle: createSpiralParticle
		};
		var spiralParticles = [];
		var total = 300;
		var maxSize = 3;
		var dbIntensity = 1;
		var speed = 0.01;
		var color = '#FFFFFF';

		return service;

		//////////////////////////////////////////////////

		function createSpiralParticle (state) {
			return {
				position: { x: state.xCenter, y: state.yCenter },
				size: genColors.get.randomNumber(0.01,1),
				angle: 0,
				speed: 0.01+Math.random(),
				targetSize: 1,
				orbit: Math.random() }

		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			for (var i = 0; i < total; i++) {
				if (angular.isUndefined(spiralParticles[i])) {
					spiralParticles.push( service.createSpiralParticle(state) );
				}

				var particle = spiralParticles[i];
				var db = audioService.getAverageDB();
				var lp = { x: particle.position.x, y: particle.position.y };
				var orbit = 1 + (state.xCenter * particle.orbit);

				particle.angle += (particle.speed  * speed) + ( db * dbIntensity /800) ;
				particle.position.x = state.xCenter + Math.cos(i + particle.angle) * orbit;
				particle.position.y = state.yCenter + Math.sin(i + particle.angle) * orbit;

				ctx.beginPath();
				ctx.fillStyle = color;

				if (db > 0 ) {
					ctx.strokeStyle = color;
					ctx.lineWidth = particle.size * maxSize;
					ctx.moveTo(lp.x, lp.y);
					ctx.lineTo(particle.position.x, particle.position.y);
					ctx.stroke();
				}

				ctx.arc(particle.position.x, particle.position.y, particle.size * maxSize / 2, 0, Math.PI*2, true);
				ctx.fill();
			}
		}
	}
})();