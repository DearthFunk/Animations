(function () {
	'use strict';
	angular
		.module('animations')
		.directive('animationCanvas', animationCanvas);

	function animationCanvas() {
		var directive = {
			restrict: 'A',
			replace: true,
			template: '<canvas class="animationCanvas" data-ng-mousedown="mouseDownEvent($event)" oncontextmenu="return false"></canvas>',
			controller: animationCanvasController,
			bindToController: true,
			scope: {

			}
		};
		return directive;
	}

	animationCanvasController.$inject = [
		'$scope',
		'$element',
		'$window',
		'animationService'
	];

	function animationCanvasController(
		$scope,
		$element,
		$window,
		animationService
	) {

		var cnv = $element[0];
		var ctx = cnv.getContext('2d');
		ctx.save();

		$scope.state = {
			w: 0,
			h: 0,
			xCenter: 0,
			yCenter: 0,
			mainRadius: 0,
			mouseDown: false,
			mouseX: 0,
			mouseY: 0,
			mouseDistanceFromCenter: 0,
			mouseHovering: false
		};
		$scope.window = angular.element($window);

		$scope.drawAnimation = drawAnimation;
		$scope.keyUpEvent = keyUpEvent;
		$scope.keyDownEvent = keyDownEvent;
		$scope.mouseMoveEvent = mouseMoveEvent;
		$scope.mouseUpEvent = mouseUpEvent;
		$scope.mouseDownEvent = mouseDownEvent;
		$scope.windowResize = windowResize;
		$scope.selectedAnimationChange = selectedAnimationChange;
		$scope.animationService = animationService;

		$scope.window.bind('resize', $scope.windowResize);
		$scope.window.bind('keyup', $scope.keyUpEvent);
		$scope.window.bind('keydown', $scope.keyDownEvent);
		$scope.window.bind('mousemove', $scope.mouseMoveEvent);
		$scope.$watch('animationService.selectedAnimation.name', $scope.selectedAnimationChange);

		$scope.windowResize();
		$scope.drawAnimation();

		///////////////////////////////////////////////////////////

		function windowResize(e) {
			$scope.state.w = $window.innerWidth;
			$scope.state.h = $window.innerHeight;
			cnv.style.width = $scope.state.w +'px';
			cnv.style.height = $scope.state.h + 'px';
			$scope.state.xCenter = $scope.state.w / 2;
			$scope.state.yCenter = $scope.state.h / 2;
			$scope.state.mainRadius = $scope.state.yCenter;
			angular.element(cnv).attr({width: $scope.state.w, height: $scope.state.h });
			selectedAnimationChange();
			var anim = animationService.selectedAnimation.service;

			if (angular.isDefined(anim.windowResizeEvent)) {
				anim.windowResizeEvent(e, $scope.state);
			}
		}

		function selectedAnimationChange() {
			ctx.restore();
			ctx.save();
			ctx.clearRect(0,0,$scope.state.w, $scope.state.h);
			if (ctx.globalCompositeOperation !== animationService.selectedAnimation.globalCompositeOperation) {
				ctx.globalCompositeOperation = animationService.selectedAnimation.globalCompositeOperation;
			}
		}

		function drawAnimation() {
			requestAnimationFrame($scope.drawAnimation);
			animationService.selectedAnimation.service.draw(ctx, $scope.state);
		}

		function mouseDownEvent(e) {
			e.stopPropagation();
			$scope.window.bind('mouseup', $scope.mouseUpEvent);
			$scope.state.mouseDown = true;

			var anim = animationService.selectedAnimation.service;
			if (angular.isDefined(anim.mouseDownEvent)) {
				anim.mouseDownEvent(e,$scope.state);
			}
		}

		function mouseUpEvent(e) {
			$scope.window.unbind('mouseup', $scope.mouseUpEvent);
			$scope.state.mouseDown = false;

			var anim = animationService.selectedAnimation.service;
			if (angular.isDefined(anim.mouseUpEvent)) {
				anim.mouseUpEvent(e, $scope.state);
			}
		}

		function keyDownEvent(e) {
			var anim = animationService.selectedAnimation.service;
			if (anim && angular.isDefined(anim.keyDownEvent)) {
				anim.keyDownEvent(e.which || e.keyCode, $scope.state);
			}
		}

		function keyUpEvent(e) {
			var anim = animationService.selectedAnimation.service;
			if (anim && angular.isDefined(anim.keyUpEvent)) {
				anim.keyUpEvent(e.which || e.keyCode, $scope.state);
			}
		}

		function mouseMoveEvent(e) {
			$scope.state.mouseX = e.clientX;
			$scope.state.mouseY = e.clientY;
			$scope.state.mouseDistanceFromCenter = Math.sqrt(
				Math.pow($scope.state.mouseX - $scope.state.xCenter, 2) +
				Math.pow($scope.state.mouseY - $scope.state.yCenter, 2)
			);

			if ($scope.state.mouseDown) {
				var anim = animationService.selectedAnimation.service;
				if (angular.isDefined(anim.mouseMoveEvent)) {
					anim.mouseMoveEvent(e, $scope.state);
				}
			}
		}
	}
})();
