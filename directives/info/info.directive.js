(function () {
	'use strict';
	angular
		.module('menu')
		.directive('info', info);

	function info() {
		var directive = {
			restrict: 'A',
			replace: true,
			templateUrl: 'directives/info/info.directive.html',
			controller: infoController,
			bindToController: true
		};
		return directive;
	}

	infoController.$inject = ['$scope', 'animationService', 'INPUT_TYPE'];

	function infoController($scope, animationService, INPUT_TYPE) {

		$scope.animationService = animationService;
		$scope.INPUT_TYPE = INPUT_TYPE;

	}
})();
