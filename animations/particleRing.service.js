(function () {
	'use strict';
	angular
		.module('animations')
		.factory('particleRing', particleRing);

	particleRing.$inject = ['genColors', 'audioService'];

	function particleRing(genColors, audioService) {

		var service = {
			draw: draw,
			createParticle: createParticle
		};
		var tracerLines = true;
		var innerRadius = 20;
		var outerRadius = 400;
		var dbIntensity = 20;
		var maxSize = 5;
		var total = 300;
		var speed = 0.05;
		var layers = 5;
		var particles = [];

		for (var i = 0; i < layers; i++) {
			particles.push([]);
		}
		
		return service;

		//////////////////////////////////////////////////

		function createParticle(state) {
			return {
				position: { x: state.xCenter, y: state.yCenter },
				size: genColors.get.randomNumber(0.01,1),
				angle: 0,
				speed: 0.05 + Math.random(),
				targetSize: 1,
				fillColor: genColors.random.rgba(),
				orbit: Math.random(),
				direction: genColors.get.randomNumber(0,1,0)}
		}
		
		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var db = audioService.getAverageDB() * dbIntensity / 10;
			for (var x = 0; x < layers; x++) {
				for (var i = 0; i < total; i++) {
					if (angular.isUndefined(particles[x][i])) {
						particles[x].push( service.createParticle(state) );
					}
					var particle = particles[x][i];

					var lp = { x: particle.position.x, y: particle.position.y };
					var dbAdjust = db/100;
					particle.direction == 0 ?
						particle.angle -= (particle.speed * speed * dbAdjust):
						particle.angle += (particle.speed * speed * dbAdjust);

					var orbit =  innerRadius + (particle.orbit * ( (outerRadius - innerRadius) ) );

					particle.position.x = state.xCenter + Math.cos(i + particle.angle) * (orbit + (db/(x+1)));
					particle.position.y = state.yCenter + Math.sin(i + particle.angle) * (orbit + (db/(x+1)));
					ctx.beginPath();
					ctx.fillStyle = particle.fillColor;

					if (tracerLines && db > 0) {
						ctx.strokeStyle = particle.fillColor;
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
	}
})();