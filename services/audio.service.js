(function () {
	'use strict';
	angular
		.module('animations')
		.factory('audioService', audioService);

	audioService.$inject = [];

	function audioService(){
		var service = {
			ctx: typeof AudioContext !== 'undefined' ? new AudioContext() : typeof webkitAudioContext !== 'undefined' ? new webkitAudioContext() : null,
			onaudioprocess: onaudioprocess,
			initialize: initialize,
			songDrawCallback: false,
			audioBufferSize: 1024,
			audioSmoothing: 0.3,

			getAverageVolume: getAverageVolume,
			getFreqArray: getFreqArray,
			getSmallArray: getSmallArray,
			getTimeArray: getTimeArray,
			getAverageDB: getAverageDB,
			getFreqArrayLeft: getFreqArrayLeft,
			getFreqArrayRight: getFreqArrayRight
		};

		service.initialize();

		return service;

		//////////////////////////////////////////

		function initialize() {
			service.nodeJavascript = service.ctx.createScriptProcessor(service.audioBufferSize, 0, 1);
			service.nodeJavascript.connect(service.ctx.destination);
			service.nodeJavascript.onaudioprocess = service.onaudioprocess;

			service.nodeAnalyserL = service.ctx.createAnalyser();
			service.nodeAnalyserR = service.ctx.createAnalyser();

			service.nodeAnalyserL.smoothingTimeConstant = service.audioSmoothing;
			service.nodeAnalyserR.smoothingTimeConstant = service.audioSmoothing;

			service.nodeAnalyserL.fftSize = service.audioBufferSize / 2;
			service.nodeAnalyserR.fftSize = service.audioBufferSize / 2;

			service.nodeAnalyserL.connect(service.nodeJavascript);

			service.nodeSplitter = service.ctx.createChannelSplitter();
			service.nodeSplitter.connect(service.nodeAnalyserL,0,0);
			service.nodeSplitter.connect(service.nodeAnalyserR,1,0);

		}

		function onaudioprocess() {
			if (service.songDrawCallback) {
				service.songDrawCallback();
			}
		}

		//////////////////////////////////////////

		function getAverageVolume (array) {
			var values = 0;
			for (var i = 0; i < array.length; i++) {
				values += array[i];
			}
			return values / array.length;
		}

		function getFreqArray(lengthSubtract) {
			var left = service.getFreqArrayLeft();
			var right = service.getFreqArrayRight();
			service.nodeAnalyserL.getByteFrequencyData(left);
			service.nodeAnalyserR.getByteFrequencyData(right);
			var theFreqArray = [];
			for (var index = 0; index < left.length - (lengthSubtract == undefined ? 0 : lengthSubtract); index++) {
				theFreqArray[index] = (left[index] + right[index]) / 2;
			}
			return theFreqArray;
		}

		function getSmallArray (depth) {
			var theSmallArray = [];
			var left = service.getFreqArrayLeft();
			var right = service.getFreqArrayRight();
			var x = depth == undefined ? 1 : depth;
			for (var i =0; i < left.length; i += x) {
				theSmallArray.push( parseInt((left[i] + right[i]) / 2, 10) );
			}
			return theSmallArray;
		}
		
		function getTimeArray() {
			var theTimeArray  = new Uint8Array(service.nodeAnalyserL.frequencyBinCount);
			service.nodeAnalyserL.getByteTimeDomainData(theTimeArray);
			return theTimeArray;
		}

		function getAverageDB() {
			var arrayL =  new Uint8Array(service.nodeAnalyserL.frequencyBinCount);
			var arrayR =  new Uint8Array(service.nodeAnalyserR.frequencyBinCount);
			service.nodeAnalyserL.getByteFrequencyData(arrayL);
			service.nodeAnalyserR.getByteFrequencyData(arrayR);
			var L =  service.getAverageVolume(arrayL);
			var R =  service.getAverageVolume(arrayR);
			return service.getAverageVolume([L,R]);
		}

		function getFreqArrayLeft() {
			var theFreqArray =  new Uint8Array(service.nodeAnalyserL.frequencyBinCount);
			service.nodeAnalyserL.getByteFrequencyData(theFreqArray);
			return theFreqArray;
		}

		function getFreqArrayRight() {
			var theFreqArray =  new Uint8Array(service.nodeAnalyserR.frequencyBinCount);
			service.nodeAnalyserR.getByteFrequencyData(theFreqArray);
			return theFreqArray;
		}

	}
})();