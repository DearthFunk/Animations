(function () {
	'use strict';
	angular
		.module('animations')
		.factory('downwardSpiral', downwardSpiral);

	downwardSpiral.$inject = ['audioService', 'genColors'];

	function downwardSpiral(audioService, genColors) {

		var service = {
			draw: draw
		};
		var numRect = 70;
		var borderColor = '#DDDDDD';
		var borderWidth = 1;
		var color = '#9B30FF';
		var stereoSplit = true;
		var radAdjust = 1.5;

		return service;

		//////////////////////////////////////////////////

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			if (stereoSplit) {
				var freqArrayL = audioService.getFreqArrayLeft();
				var freqArrayR = audioService.getFreqArrayRight();

				for (var index = 0; index < freqArrayL.length; index++) {
					if (index % 2 == 0) {

						var startX = state.xCenter / 2;
						var startY = state.yCenter;
						var a1 = ((index + 0) * (360/numRect))*Math.PI/180;
						var a2 = ((index + 1) * (360/numRect))*Math.PI/180;
						var radius = freqArrayL[index] * radAdjust;

						ctx.strokeStyle = borderColor;
						ctx.lineWidth = borderWidth;

						ctx.fillStyle = genColors.convert.rgba(color,index/255);

						ctx.beginPath();
						ctx.moveTo(startX,startY);
						ctx.lineTo(startX + (radius * Math.cos(a1)),startY + (radius * Math.sin(a1)));
						ctx.lineTo(startX + (radius * Math.cos(a2)),startY + (radius * Math.sin(a2)));
						ctx.lineTo(startX,startY);
						ctx.stroke();
						ctx.fill();
					}
				}
				for (index = 0; index < freqArrayR.length; index++) {
					if (index % 2 == 0) {
						startX = state.w * 0.75 ;
						startY = state.yCenter;
						a1 = ((index + 0) * (360/numRect))*Math.PI/180;
						a2 = ((index + 1) * (360/numRect))*Math.PI/180;
						radius = freqArrayR[index] * radAdjust;

						ctx.strokeStyle = borderColor;
						ctx.lineWidth = borderWidth;

						ctx.fillStyle = genColors.convert.rgba(color,index/255);

						ctx.beginPath();
						ctx.moveTo(startX,startY);
						ctx.lineTo(startX + (radius * Math.cos(a1)),startY + (radius * Math.sin(a1)));
						ctx.lineTo(startX + (radius * Math.cos(a2)),startY + (radius * Math.sin(a2)));
						ctx.lineTo(startX,startY);
						ctx.stroke();
						ctx.fill();
					}
				}

			}
			else {
				var freqArray = audioService.getFreqArray();
				for (index = 0; index < freqArray.length; index++) {
					if (index % 2 == 0) {
						startX = state.xCenter;
						startY = state.yCenter;
						a1 = ((index + 0) * (360/numRect))*Math.PI/180;
						a2 = ((index + 1) * (360/numRect))*Math.PI/180;
						radius = freqArray[index] * 3;

						ctx.strokeStyle = borderColor;
						ctx.lineWidth = borderWidth;

						ctx.fillStyle = genColors.convert.rgba(color,index/255);

						ctx.beginPath();
						ctx.moveTo(startX,startY);
						ctx.lineTo(startX + (radius * Math.cos(a1)),startY + (radius * Math.sin(a1)));
						ctx.lineTo(startX + (radius * Math.cos(a2)),startY + (radius * Math.sin(a2)));
						ctx.lineTo(startX,startY);
						ctx.stroke();
						ctx.fill();
					}
				}
			}
		}
	}
})();