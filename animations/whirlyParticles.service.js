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
		var baseColor = 'rgba(255,255,0,0.5)';
		var baseSize = 7;
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
			ctx.clearRect(0,0,state.w, state.h);
			var db = audioService.getAverageDB();
			var dbAdjust = db / 15;
			for (var i = 0; i < total; i++) {
				if (angular.isUndefined(whirlyParticles[i])) {whirlyParticles.push( service.createWhirlyParticle(state) ); }

				var particle = whirlyParticles[i];
				particle.position.x += particle.xMod * speed;
				particle.position.y += particle.yMod * speed;
				particle.angle += (particle.speed  * speed) + ( dbAdjust / 800) ;

				if (dbAdjust > dbDegrade) {
					var orbit = (state.xCenter * particle.orbit) / (400/dbAdjust);
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
					var r = particle.size * maxSize / 2;
					ctx.fillStyle = r < baseSize ? baseColor : particle.fillColor;
					ctx.arc(particle.position.x, particle.position.y, r, 0, Math.PI*2, true);
					ctx.fill();
				}
			}
		}
	}
})();