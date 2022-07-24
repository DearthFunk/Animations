(function(){
	'use strict';
	angular
		.module('animations')
		.directive('sliderHorizontal', sliderHorizontal);

	sliderHorizontal.$inject = ['$timeout', '$window', 'STARTING_VOLUME'];
	function sliderHorizontal($timeout, $window, STARTING_VOLUME) {
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

			var sliding = false;
			var startX, originalX, newValue;
			var lastValue = scope.sliderValue;
			var xMin = 0;

			scope.window = angular.element($window);
			scope.mouseUpEvent = mouseUpEvent;
			scope.mouseMoveEvent = mouseMoveEvent;
			scope.getSliderValue = getSliderValue;
			scope.resetToOriginal = resetToOriginal;
			scope.startMovingSlider = startMovingSlider;
			scope.movePos = movePos;

			$timeout(function(){
				scope.width = element[0].getBoundingClientRect().width;
			});

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
				scope.sliderValue = STARTING_VOLUME;
			}

			function startMovingSlider(event) {
				scope.window.bind('mouseup', scope.mouseUpEvent);
				scope.window.bind('mousemove', scope.mouseMoveEvent);
				sliding = true;
				startX = event.clientX;
				newValue = parseInt(scope.sliderValue * scope.width);
				originalX = newValue;
			}

			function movePos(e) {
				if (sliding) { return; }
				scope.sliderValue = (e.clientX - element[0].getBoundingClientRect().left) / scope.width;
				scope.startMovingSlider(e);
			}

			function mouseUpEvent() {
				scope.window.unbind('mouseup', scope.mouseUpEvent);
				scope.window.unbind('mousemove', scope.mouseMoveEvent);
				sliding = false;
			}

			function mouseMoveEvent(event) {
				if (!sliding) { return; }
				var newLeft = originalX - startX + event.clientX;

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
				console.log(scope.sliderValue);
				scope.$apply();
			}
		}
	}
})();
