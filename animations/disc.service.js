(function () {
	'use strict';
	angular
		.module('animations')
		.factory('discService', discService);

	discService.$inject = ['genColors'];

	function discService(genColors) {

		var service = {
			draw: draw,
			windowResizeEvent: windowResizeEvent
		};

		var distanceFromCenter = 0;
		var updateColors = false;
		var colorIndex = 0;
		var rad = 0;
		var angleSize = 0;
		var discSlices = 60;
		var discRows = 10;
		var verticalPadding = 5;
		var disc = [];
		var sliceAngles = [];
		var hoverRow = -1;
		var hoverSlice = -1;
		var colorLength = 100;
		var colorOne = '#FF0000'; //'#AA8639';
		var colorTwo = '#0000FF'; //'#553A00';
		var mouseAdjust = 1;

		return service;

		//////////////////////////////////////////////////

		function windowResizeEvent(e, state) {
			disc = [];
			rad = state.h / 2 - (verticalPadding*2);
			angleSize =  Math.PI * 2 / discSlices;
			for (var i = 0; i < discRows+2; i++) {
				var ring = {
					index: i,
					rad: rad / discRows * i,
					slice: []
				};
				for (var d = 0; d < discSlices; d++) {
					sliceAngles[d] = angleSize * d;
					var c1 = genColors.randomBetween.rgba(colorOne, colorTwo);
					var c2 = genColors.randomBetween.rgba(colorOne, colorTwo);
					ring.slice.push ({
						a1: angleSize * d,
						a2: angleSize * (d+1),
						x: state.xCenter + (ring.rad) * Math.cos(angleSize * (d)),
						y: state.yCenter + (ring.rad) * Math.sin(angleSize * (d)),
						c: genColors.array.rgba(c1, c2, colorLength)
					})
				}
				disc.push(ring);
			}
			sliceAngles[discSlices] = angleSize * (d+1);
		}

		function checkHoverPosition(state) {
			distanceFromCenter = Math.sqrt(
				Math.pow(state.mouseX - (state.w / 2), 2) +
				Math.pow(state.mouseY - (state.h / 2), 2) );
			if (distanceFromCenter < rad) {
				for (var layer = 0; layer < disc.length-1; layer++) {
					if (distanceFromCenter > disc[layer].rad && distanceFromCenter < disc[layer+1].rad) {
						hoverSlice = layer;
						break;
					}
				}
				var angle = Math.atan2((state.h/2) - state.mouseY, state.w / 2 - state.mouseX) + Math.PI;
				for (var i = 0; i < discSlices; i++) {
					if (angle > sliceAngles[i] && angle < sliceAngles[i+1]) {
						hoverRow = i;
						break;
					}
				}
			}
			else {
				hoverRow = -1;
				hoverSlice = -1;
			}
		}

		function draw(ctx, state) {
			colorIndex++;
			if (colorIndex >= colorLength) {
				colorIndex = 0;
				updateColors = true;

			}
			ctx.clearRect(0,0,state.w,state.h);
			checkHoverPosition(state);

			for (var sliceIndex = 0; sliceIndex < disc[0].slice.length; sliceIndex++) {
				for (var rowIndex = 0; rowIndex < disc.length-2; rowIndex++) {

					var rIndex = rowIndex == disc.length-1 ? 0 : rowIndex + 1;
					var sIndex = sliceIndex == disc[0].slice.length-1 ? 0 : sliceIndex + 1;
					var p1 = disc[rowIndex].slice[sliceIndex];
					var p2 = disc[rIndex].slice[sliceIndex];
					var p3 = disc[rowIndex].slice[sIndex];
					var p4 = disc[rIndex].slice[sIndex];

					var xAdjust = (state.mouseX - state.xCenter) / mouseAdjust;
					var yAdjust = (state.mouseY - state.yCenter) / mouseAdjust;
					var rAjust = Math.abs(xAdjust + yAdjust) * 10;

					ctx.beginPath();
					ctx.moveTo(p1.x,p1.y);
					ctx.lineTo(p2.x, p2.y);
					//ctx.arc(state.xCenter, state.yCenter, disc[rIndex].rad, p2.a1, p2.a2, false);
					ctx.bezierCurveTo(p2.x, p2.y, p3.x + xAdjust, p3.y +yAdjust, p4.x, p4.y);
					ctx.lineTo(p3.x,p3.y);
					ctx.arc(state.xCenter, state.yCenter, disc[rowIndex].rad, p1.a2, p1.a1, true);

					if (updateColors) {
						var c1 = p1.c[colorLength-1];
						var c2 = genColors.randomBetween.rgba(colorOne, colorTwo);
						p1.c = genColors.array.rgba(c1, c2, colorLength)
					}

					if (sliceIndex === hoverRow && hoverSlice === rowIndex) { // hover cell
						ctx.lineWidth = 1;
						ctx.strokeStyle = '#FFFFFF';
						ctx.fillStyle = 'rgba(100,100,100,0.5)';
						ctx.stroke();
						ctx.fill();
					}
					else {
						ctx.lineWidth = 0.2;
						ctx.strokeStyle = 'rgba(255,255,255,0.5)';
						ctx.fillStyle = disc[rowIndex].slice[sliceIndex].c[colorIndex];
						ctx.stroke();
						ctx.fill();
					}

					ctx.closePath();
				}
			}
			updateColors = false;
		}
	}
})();