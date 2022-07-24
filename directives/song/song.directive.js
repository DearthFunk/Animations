(function () {
	'use strict';
	angular
		.module('animations')
		.directive('song', song)
		.constant('STARTING_VOLUME', 0.2);

	song.$inject = ['audioService', '$window', 'genColors', '$timeout', 'STARTING_VOLUME'];
	
	function song(audioService, $window, genColors, $timeout, STARTING_VOLUME) {
		var directive = {
			restrict: 'A',
			replace: true,
			templateUrl: 'directives/song/song.directive.html',
			scope: {
				trackVolume: '='
			},
			link: linkFunction
		};
		return directive;

		//////////////////////////////////

		function linkFunction(scope, element) {

			var movingMarker = false;
			var visCnv = element[0].querySelector('#songCanvas');
			var imgContainer = element[0].querySelector('.imgContainer');

			scope.visCtx = visCnv.getContext('2d');
			scope.playLinePosition = 0;
			scope.window = angular.element($window);
			scope.playPause = playPause;
			scope.mouseDownEvent = mouseDownEvent;
			scope.mouseMoveEvent = mouseMoveEvent;
			scope.mouseUpEvent = mouseUpEvent;
			scope.setUpTrack = setUpTrack;
			scope.drawVisualizer = drawVisualizer;
			scope.trackCanPlay = trackCanPlay;
			scope.adjustVolume = adjustVolume;

			$timeout(function(){
				scope.imgSize = imgContainer.getBoundingClientRect();
				visCnv.style.width = scope.imgSize.width + 'px';
				visCnv.style.height = scope.imgSize.height + 'px';
				angular.element(visCnv).attr({width: scope.imgSize.width, height: scope.imgSize.height});
				scope.setUpTrack();
			});

			////////////////////////////////////////////////////////////

			function adjustVolume(){
				scope.track.volume = genColors.get.roundedNumber(scope.trackVolume, 2);
			}

			function setUpTrack() {
				scope.track = document.createElement('audio');
				scope.track.style.display = "none";
				scope.track.src = 'media/7.mp3';

				scope.track.preload = 'metadata';
				scope.track.playable = false;
				scope.track.codec = 'mp3';
				scope.track.type = 'audio/mp3';
				scope.track.addEventListener('canplay', scope.trackCanPlay);
				scope.track.volume = STARTING_VOLUME;
				scope.$watch('trackVolume', scope.adjustVolume);
			}

			function trackCanPlay() {
				scope.track.source = audioService.ctx.createMediaElementSource(scope.track);
				scope.track.source.connect(audioService.nodeSplitter);
				scope.track.source.connect(audioService.ctx.destination);
				scope.track.removeEventListener('canplay', scope.trackCanPlay);
				audioService.songDrawCallback = scope.drawVisualizer;
			}

			function playPause(e) {
				if (scope.track.paused) {
					scope.track.play();
				}
				else {
					scope.track.pause();
				}
			}

	// EVENTS ////////////////////////////////////////////////

			function mouseDownEvent(e) {
				scope.window.bind('mouseup', scope.mouseUpEvent);
				scope.window.bind('mousemove', scope.mouseMoveEvent);
				if (e) { e.preventDefault(); }
				if (e.which === 1) {
					if (scope.track.paused) {
						scope.playPause();
					}
					movingMarker = true;
					scope.track.currentTime = (e.pageX - scope.imgSize.left) / scope.imgSize.width * scope.track.duration;
				}
			}

			function mouseUpEvent() {
				scope.window.unbind('mouseup', scope.mouseUpEvent);
				scope.window.unbind('mousemove', scope.mouseMoveEvent);
				movingMarker = false;
			}

			function mouseMoveEvent(e) {
				if (movingMarker && e) {
					e.preventDefault();
					var newX = (e.pageX - scope.imgSize.left) / scope.imgSize.width * scope.track.duration;
					if (newX < 0) {
						newX = 0;
					}
					if (newX > scope.track.duration) {
						newX = 0;
						movingMarker = false;
					}
					if (scope.track.readyState !== 0) {
						scope.track.currentTime = newX;
					}
				}
			}
			
	// visualizations ////////////////////////////////////////

			function drawVisualizer() {
				var freqArray = audioService.getFreqArray(230);
				scope.visCtx.clearRect(0, 0, scope.imgSize.width, scope.imgSize.height);
				scope.playLinePosition = scope.track.currentTime / scope.track.duration * 100;
				scope.$digest();

				var chunkWidth = scope.imgSize.width / freqArray.length;
				var chunkSpacer = chunkWidth * 0.2;

				for (var index = 0; index < freqArray.length; index++) {
					var chunkHeight = parseInt(freqArray[index], 10) / 230 * -1;
					scope.visCtx.beginPath();
					scope.visCtx.rect(index * chunkWidth + 1,
						scope.imgSize.height - 2,
						chunkWidth - chunkSpacer,
						chunkHeight * (scope.imgSize.height-12));
					scope.visCtx.fillStyle = 'rgba(38,100,255,0.5)';
					scope.visCtx.fill();
					scope.visCtx.closePath();
				}
			}

		}
	}
})();