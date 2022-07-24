(function () {
	'use strict';
	angular
		.module('animations')
		.directive('squaresControls', squaresControls);

	function squaresControls() {
		var directive = {
			restrict: 'A',
			replace: true,
			templateUrl: 'directives/squaresControls/squaresControls.directive.html',
			controller: squaresControlsController,
			bindToController: true
		};
		return directive;
	}

	squaresControlsController.$inject = ['$scope', 'animationService'];

	function squaresControlsController($scope, animationService) {

		$scope.animationService = animationService;
		$scope.toggle = toggle;

		/////////////////////////////////////////////////////

		function toggle(index){
			animationService.selectedAnimation.service.rotations[index] = !animationService.selectedAnimation.service.rotations[index];
		}

	}
})();
