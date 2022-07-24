(function () {
	'use strict';
	angular
		.module('animations')
		.factory('tunnel', tunnel);

	tunnel.$inject = ['genColors', 'audioService'];

	function tunnel(genColors, audioService) {

		var service = {
			draw: draw
		};
		var lines = [{r:0},{r:8}];
		var color = '#FFFFFF';
		var speed = 1;
		var dbOpacity = false;

		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var nextIndex = false;
			var db = audioService.getAverageDB();

			ctx.lineWidth = 1;

			dbOpacity ?
				ctx.strokeStyle = genColors.convert.rgba(color,db/60) :
				ctx.strokeStyle = genColors.convert.rgba(color,1);

			for (var index = 0; index < lines.length + 1; index++) {
				if (angular.isDefined(lines[index])) {
					lines[index].r += (Math.round( speed * 10 ) / 10) + (Math.pow(lines[index].r,2) / 20000) + (db/3);
					ctx.beginPath();

					ctx.arc(
						state.xCenter,
						state.yCenter,
						lines[index].r,
						0,
						2 * Math.PI,
						true
					);

					ctx.stroke();
				}
				else if (!nextIndex && lines.length){
					nextIndex = true;
					if (lines[index-1].r > 8) { lines.push({r:1}); }
				}
			}
			for (index = 0; index < lines.length; index++) {
				if (lines[index].r > state.xCenter + 60) {lines.splice(index,1);}
			}
		}
	}
})();