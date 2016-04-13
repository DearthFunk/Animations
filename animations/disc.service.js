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
		var discSlices = 20;
		var discRows = 5;
		var disc = [];
		var verticalPadding = 20;
		var rad;
		var sliceAngles = [];
		var initialized = false;
		var hoverSample = -1;
		var hoverBeat = -1;
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
					beats: []
				};
				for (var d = 0; d < discSlices; d++) {
					sliceAngles[d] = angleSize * d;
					ring.beats.push ({
						a1: angleSize * d,
						a2: angleSize * (d+1),
						x: state.xCenter + (ring.rad) * Math.cos(angleSize * (d)),
						y: state.yCenter + (ring.rad) * Math.sin(angleSize * (d))
					})
				}
				disc.push(ring);
			}
			sliceAngles[discSlices] = angleSize * (d+1);
			initialized = true;
		}

		function checkHoverPosition(state) {
			var distanceFromCenter = Math.sqrt(
				Math.pow(state.mouseX - (state.w / 2), 2) + Math.pow(state.mouseY - (state.h/2), 2) );
			if (distanceFromCenter < rad) {
				for (var layer = 0; layer < disc.length-1; layer++) {
					if (distanceFromCenter > disc[layer].rad && distanceFromCenter < disc[layer+1].rad) {
						hoverBeat = layer;
						break;
					}
				}
				var angle = Math.atan2((state.h/2) - state.mouseY, state.w / 2 - state.mouseX) + Math.PI;
				for (var i = 0; i < discSlices; i++) {
					if (angle > sliceAngles[i] && angle < sliceAngles[i+1]) {
						hoverSample = i;
						break;
					}
				}
			}
			else {
				hoverSample = -1;
				hoverBeat = -1;
			}
		}

		function draw(ctx, state) {
			ctx.clearRect(0,0,state.w,state.h);
			checkHoverPosition(state);

			for (var sIndex = 0; sIndex < discSlices; sIndex++) {
				for (var rIndex = 0; rIndex < discRows; rIndex++) {

					var Sind2 = rIndex == discRows-1 ? 0 : rIndex + 1;
					var bInd2 = sIndex == discSlices-1 ? 0 : sIndex + 1;
					var p1 = disc[rIndex].beats[sIndex];
					var p2 = disc[Sind2].beats[sIndex];
					var p3 = disc[rIndex].beats[bInd2];
					var p4 = disc[Sind2].beats[bInd2];

					ctx.beginPath();
					ctx.moveTo(p1.x,p1.y);
					ctx.lineTo(p2.x, p2.y);
					ctx.arc(state.xCenter, state.yCenter, disc[Sind2].rad, p2.a1, p2.a2, false);
					ctx.lineTo(p3.x,p3.y);
					ctx.arc(state.xCenter, state.yCenter, disc[rIndex].rad, p1.a2, p1.a1, true);



					if (sIndex === hoverSample && hoverBeat === rIndex) { // hover cell
						ctx.lineWidth = 3;
						ctx.strokeStyle = "#000000";
						ctx.fillStyle = "rgba(100,255,100,0.5)";
					}
					else {
						ctx.lineWidth = 1;
						ctx.strokeStyle = "rgba(255,255,255,0.5)";
						ctx.fillStyle = 'rgba(0,0,0,0)';
					}

					ctx.stroke();
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}
})();