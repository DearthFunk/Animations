(function () {
	'use strict';
	angular
		.module('animations')
		.directive('menu', menu);

	function menu() {
		var directive = {
			restrict: 'A',
			replace: true,
			templateUrl: 'directives/menu/menu.directive.html',
			controller: menuController,
			bindToController: true
		};
		return directive;
	}

	menuController.$inject = ['$scope', 'animationService', 'INPUT_TYPE'];

	function menuController($scope, animationService, INPUT_TYPE) {

		$scope.changeAnimation = changeAnimation;
		$scope.animationService = animationService;
		$scope.INPUT_TYPE = INPUT_TYPE;

		/////////////////////////////////////////////////////

		function changeAnimation(animation) {
			animationService.selectedAnimation = animation;
		}

	}
})();
