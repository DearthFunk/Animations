(function(){
	angular
		.module('animations')
		.directive('sliderVertical', sliderVertical);

	sliderVertical.$inject = [];
	function sliderVertical() {
		return {
			restrict: 'C',
			templateUrl: 'elements/sliderVertical/sliderVertical.html',
			replace: true,
			scope: {
				sliderValue: "=sliderValue",
				callBack: "=callBack"
			},
			link: linkFunction
		};

		////////////////////////////////

		function linkFunction(scope, element) {

			scope.height = element[0].getBoundingClientRect().height;
			var sliding, startY, originalY, newValue;
			var lastValue = scope.sliderValue;
			var startingValue = scope.sliderValue;
			var xMin = 0;

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
				scope.callBack.toRun(1);
			}

			function startMovingSlider(event) {
				sliding = true;
				startY = event.clientY;
				newValue = parseInt(scope.sliderValue * scope.height);
				originalY = newValue;
			}

			function movePos(e) {
				if (sliding) { return; }
				scope.sliderValue = (e.clientY - element[0].getBoundingClientRect().top) / scope.height;
				scope.callBack.toRun(1 - (roundedNumber(scope.sliderValue, 1)));
				scope.startMovingSlider(e);
			}

			function mouseUpEvent() {
				sliding = false;
			}

			function mouseMoveEvent(event, args) {
				if (!sliding) { return; }
				var newLeft = originalY - startY + args.clientY;

				if (newLeft < xMin) {
					newLeft = xMin;
					scope.sliderValue = 0;
				}
				if (newLeft > scope.height) {
					newLeft = scope.height;
					scope.sliderValue = 1;
				}
				newValue = newLeft;

				//prevents calling action when the value does not change
				if (lastValue != newValue) {
					scope.sliderValue = ((newValue - xMin) / (scope.height - xMin));
					scope.callBack.toRun(1 - (roundedNumber(scope.sliderValue, 1)));
					lastValue = newValue;
				}
			}
		}
	}
})();
