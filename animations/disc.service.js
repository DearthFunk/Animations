(function () {
	'use strict';
	angular
		.module('animations')
		.factory('discService', discService);

	discService.$inject = [];

	function discService() {

		var service = {
			draw: draw,
			windowResizeEvent: windowResizeEvent
		};

		var angleSize = 0;
		var discSlices = 30;
		var discRows = 5;
		var disc = [];
		var verticalPadding = 20;
		var rad;
		var sliceAngles = [];
		var hoverRow = -1;
		var hoverSlice = -1;

		return service;

		//////////////////////////////////////////////////

		function windowResizeEvent(e, state) {
			disc = [];
			rad = state.h / 2 - (verticalPadding*2);
			angleSize =  Math.PI * 2 / discSlices;
			for (var i = 0; i < discRows; i++) {
				var ring = {
					index: i,
					rad: rad / discRows * i,
					slice: []
				};
				for (var d = 0; d < discSlices; d++) {
					sliceAngles[d] = angleSize * d;
					ring.slice.push ({
						a1: angleSize * d,
						a2: angleSize * (d+1),
						x: state.xCenter + (ring.rad) * Math.cos(angleSize * (d)),
						y: state.yCenter + (ring.rad) * Math.sin(angleSize * (d))
					})
				}
				disc.push(ring);
			}
			sliceAngles[discSlices] = angleSize * (d+1);
		}

		function checkHoverPosition(state) {
			var distanceFromCenter = Math.sqrt(
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
			ctx.clearRect(0,0,state.w,state.h);
			checkHoverPosition(state);

			for (var sliceIndex = 0; sliceIndex < discSlices; sliceIndex++) {
				for (var rowIndex = 0; rowIndex < discRows; rowIndex++) {

					var rIndex = rowIndex == discRows-1 ? 0 : rowIndex + 1;
					var sIndex = sliceIndex == discSlices-1 ? 0 : sliceIndex + 1;
					var p1 = disc[rowIndex].slice[sliceIndex];
					var p2 = disc[rIndex].slice[sliceIndex];
					var p3 = disc[rowIndex].slice[sIndex];
					var p4 = disc[rIndex].slice[sIndex];

					ctx.beginPath();
					ctx.moveTo(p1.x,p1.y);
					ctx.lineTo(p2.x, p2.y);
					ctx.arc(state.xCenter, state.yCenter, disc[rIndex].rad, p2.a1, p2.a2, false);
					ctx.lineTo(p3.x,p3.y);
					ctx.arc(state.xCenter, state.yCenter, disc[rowIndex].rad, p1.a2, p1.a1, true);

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
						ctx.stroke();
					}

					ctx.closePath();
				}
			}
		}
	}
})();