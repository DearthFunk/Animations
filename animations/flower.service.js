(function () {
	'use strict';
	angular
		.module('animations')
		.factory('flower', flower);

	flower.$inject = ['genColors', 'audioService'];

	function flower(genColors, audioService) {

		var service = {
			draw: draw,
			circleDecay: circleDecay
		};
		
		var decayingCircles = [];
		var numLeaves = 10;
		var totalCircleDecay = 200;
		var stemSize = 10;
		var stemColor = '#49311c';
		var circleColor = '#FF0000';
		var leavesColor = '#00BB00';
		var lineColor = '#666666';
		var lineSize = 1;
		var lineLength = 6;
		var showStem = true;
		var showLines = true;
		var budRadius = 40;
		var leavesBorder = 2;
		var showScope = true;
		var budBumpsColor = '#EEEE00';
		var budBumpsBorder = '#FF0000';
		var budBumpsRadius = 20;
		var budColor = '#00FF00';
		var budBorder = '#FF0000';
		var scopeColor = '#000000';


		return service;

		//////////////////////////////////////////////////

		function circleDecay(state) {
			return {
				x: state.xCenter,
				y: state.yCenter,
				r: genColors.get.randomNumber(0,30),
				xAdd:genColors.get.randomNumber(-10,10),
				yAdd:genColors.get.randomNumber(-10,10),
				rDec: genColors.get.randomNumber(0.1,10)
			}
		}
		
		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w, state.h);
			var freqData = audioService.getFreqArray(200);
			var dbLevel = audioService.getAverageDB();
			var x = state.xCenter;
			var y = state.yCenter;

			for (var i = 0; i < totalCircleDecay; i++) {

				if (dbLevel > 0) {
					if (decayingCircles[i] == undefined) {	decayingCircles.push(service.circleDecay(state)); }
					if (decayingCircles[i].r <=0)        {	decayingCircles[i] = service.circleDecay(state);  }
				}
				if (angular.isDefined(decayingCircles[i])) {
					decayingCircles[i].x += decayingCircles[i].xAdd;
					decayingCircles[i].y += decayingCircles[i].yAdd;
					decayingCircles[i].r -= decayingCircles[i].rDec;
					if (dbLevel<=0){ decayingCircles[i].r -= 5;}

					if (decayingCircles[i].r > 0) {
						ctx.beginPath();
						ctx.fillStyle = circleColor;
						ctx.arc(decayingCircles[i].x,decayingCircles[i].y,decayingCircles[i].r,  0,	2 * Math.PI, true);
						ctx.fill();
						ctx.closePath();
					}
				}
			}

			if (showStem) {
				ctx.beginPath();
				ctx.strokeStyle = stemColor;
				ctx.lineWidth = stemSize;
				ctx.moveTo(x,y);
				ctx.quadraticCurveTo(x-50,y-300, x-100,y*2);
				ctx.stroke();
				ctx.closePath();
			}

			var innerRadius = (dbLevel/40) + budRadius;
			for (var index = 0; index < freqData.length; index++) {

				var radius2 = budRadius + freqData[index];
				var a1 = ((index + 0) * (360/numLeaves))*Math.PI/180;
				var a2 = ((index + 1) * (360/numLeaves))*Math.PI/180;
				var x1 = x + (budRadius * Math.cos(a1) + (1/budRadius));
				var y1 = y + (budRadius * Math.sin(a1) + (1/budRadius));
				var x2 = x + (budRadius * Math.cos(a2) + (1/budRadius));
				var y2 = y + (budRadius * Math.sin(a2) + (1/budRadius));
				var x3 = x + (radius2 * Math.cos(a2) + (1/radius2));
				var y3 = y + (radius2 * Math.sin(a2) + (1/radius2));
				var x4 = x + (radius2 * Math.cos(a1) + (1/radius2));
				var y4 = y + (radius2 * Math.sin(a1) + (1/radius2));

				ctx.strokeStyle = leavesBorder;
				ctx.lineWidth = 1;
				ctx.fillStyle = genColors.convert.rgba(leavesColor, index / freqData.length);
				ctx.beginPath();
				ctx.moveTo(x2,y2);
				ctx.bezierCurveTo(x3,y3, x4,y4, x1,y1);
				ctx.stroke();
				ctx.fill();
				ctx.closePath();

				if (showLines) {
					ctx.strokeStyle= genColors.convert.rgba(lineColor, dbLevel/60);
					ctx.beginPath();
					ctx.lineWidth = lineSize;
					ctx.moveTo(x1,y1);
					ctx.lineTo(
						x + (radius2*(parseInt(lineLength,10)/10) * Math.cos(a1) ),
						y + (radius2*(parseInt(lineLength,10)/10) * Math.sin(a1) )
					);
					ctx.stroke();
					ctx.closePath();
				}


				ctx.fillStyle = budBumpsColor;
				ctx.strokeStyle = budBumpsBorder;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.arc(x1, y1, (dbLevel/20) + budBumpsRadius, 0,	2 * Math.PI, true);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();

			}

			ctx.fillStyle = budColor;
			ctx.strokeStyle = budBorder;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(x, y, innerRadius , 0,	2 * Math.PI, true);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();

			if (showScope) {
				var percent2;
				var timeArray = audioService.getTimeArray();

				var padding = 2;
				var barWidth = (innerRadius-padding) * 2 / timeArray.length;
				for (index = 0; index < timeArray.length; index++) {
					var percent1 = timeArray[index] / 256;
					percent2 = index < timeArray.length ?
						timeArray[index+1] / 256 :
						timeArray[index  ] / 256;

					var offset1, offset2;
					offset1 = index == 0 ?
						state.yCenter :
						state.yCenter + (innerRadius*2*(percent1-0.5));
					offset2 = index == timeArray.length-1 ?
						state.yCenter :
						state.yCenter + (innerRadius*2*(percent2-0.5));

					ctx.beginPath();
					ctx.lineWidth = 2;
					ctx.strokeStyle = scopeColor;
					ctx.moveTo(index*barWidth + padding +(state.xCenter-innerRadius),offset1);
					ctx.lineTo(index*barWidth + padding +(state.xCenter-innerRadius) + barWidth,offset2);
					ctx.stroke();
					ctx.closePath();
				}
			}
		}
	}
})();