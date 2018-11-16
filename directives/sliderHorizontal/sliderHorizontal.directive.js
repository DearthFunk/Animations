(function(){
	'use strict';
	angular
		.module('animations')
		.directive('sliderHorizontal', sliderHorizontal);

	sliderHorizontal.$inject = [];
	function sliderHorizontal() {
		return {
			restrict: 'A',
			templateUrl: 'directives/sliderHorizontal/sliderHorizontal.directive.html',
			replace: true,
			scope: {
				sliderValue: '=sliderValue'
			},
			link: linkFunction
		};

		////////////////////////////////

		function linkFunction(scope, element) {

			var sliding, startX, originalX, newValue;
			var lastValue = scope.sliderValue;
			var startingValue = scope.sliderValue;
			var xMin = 0;

			scope.width = element[0].getBoundingClientRect().width;

			scope.getSliderValue = getSliderValue;
			scope.resetToOriginal = resetToOriginal;
			scope.startMovingSlider = startMovingSlider;
			scope.movePos = movePos;
			scope.$on('mouseUpEvent', mouseUpEvent);
			scope.$on('mouseMoveEvent', mouseMoveEvent);

			///////////////////////////////////////////////

			function getSliderValue() {
				if (scope.sliderValue > 1) {
					scope.sliderValue = 1;
				}
				if (scope.sliderValue < 0) {
					scope.sliderValue = 0;
				}
				return scope.sliderValue;
			}

			function resetToOriginal() {
				scope.sliderValue = startingValue;
			}

			function startMovingSlider(event) {
				sliding = true;
				startX = event.clientX;
				newValue = parseInt(scope.sliderValue * scope.width);
				originalX = newValue;
			}

			function movePos(e) {
				if (sliding) { return; }
				scope.sliderValue = (e.clientX - element[0].getBoundingClientRect().top) / scope.width;
				scope.startMovingSlider(e);
			}

			function mouseUpEvent() {
				sliding = false;
			}

			function mouseMoveEvent(event, args) {
				if (!sliding) { return; }
				var newLeft = originalX - startX + args.clientX;

				if (newLeft < xMin) {
					newLeft = xMin;
					scope.sliderValue = 0;
				}
				if (newLeft > scope.width) {
					newLeft = scope.width;
					scope.sliderValue = 1;
				}
				newValue = newLeft;

				//prevents calling action when the value does not change
				if (lastValue !== newValue) {
					scope.sliderValue = ((newValue - xMin) / (scope.width - xMin));
					lastValue = newValue;
				}
			}
		}
	}
})();
