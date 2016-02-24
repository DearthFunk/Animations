(function () {
	'use strict';
	angular
		.module('animations')
		.factory('whirlyParticles', whirlyParticles);

	whirlyParticles.$inject = ['genColors', 'audioService'];

	function whirlyParticles(genColors, audioService) {

		var service = {
			draw: draw,
			createWhirlyParticle: createWhirlyParticle
		};
		var total = 1000;
		var maxSize = 70;
		var speed = 0.1;
		var baseColor = '#FFFF00';
		var whirlyParticles = [];
		var dbDegrade = 4.5;
		
		return service;

		//////////////////////////////////////////////////

		function createWhirlyParticle(state) {
			return {
				position: { x: state.xCenter, y: state.yCenter },
				size: genColors.get.randomNumber(0.01,1),
				fillColor: genColors.random.rgba(),
				xMod: genColors.get.randomNumber(-10,10),
				yMod: genColors.get.randomNumber(-10,10),
				angle: 0,
				speed: 0.01+Math.random(),
				orbit: Math.random()
			}
		}
		
		function draw(ctx, state) {
			var db = audioService.getAverageDB() / 15;
			for (var i = 0; i < total; i++) {
				if (angular.isUndefined(whirlyParticles[i])) {whirlyParticles.push( service.createWhirlyParticle(state) ); }

				var particle = whirlyParticles[i];
				particle.position.x += particle.xMod * speed;
				particle.position.y += particle.yMod * speed;
				particle.angle += (particle.speed  * speed) + ( db / 800) ;

				if (db > dbDegrade) {
					var orbit = (state.xCenter * particle.orbit) / (400/db);
					particle.position.x += Math.cos(i + particle.angle) * orbit;
					particle.position.y += Math.sin(i + particle.angle) * orbit;
					if (particle.position.x < 0 || particle.position.x > state.w  ||
						particle.position.y < 0 || particle.position.y > state.h ||
						particle.size < 0) {
						whirlyParticles[i] = service.createWhirlyParticle(state);
					}
				}
				else {

				}
				particle.size -= 0.02;
				if (particle.size > 0) {
					ctx.beginPath();
					ctx.fillStyle = db > dbDegrade ? particle.fillColor : baseColor;
					ctx.arc(particle.position.x, particle.position.y, particle.size * maxSize / 2, 0, Math.PI*2, true);
					ctx.fill();
				}
			}
		}
	}
})();