(function () {
	'use strict';
	angular
		.module('animations')
		.factory('gridFlow', gridFlow);

	gridFlow.$inject = [];

	function gridFlow() {

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