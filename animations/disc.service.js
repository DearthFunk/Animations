(function () {
	'use strict';
	angular
		.module('animations')
		.factory('discService', discService);

	discService.$inject = [];

	function discService() {

		var service = {
			draw: draw
		};

		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);

		}
	}
})();