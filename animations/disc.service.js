(function () {
	'use strict';
	angular
		.module('animations')
		.factory('discService', discService);

	discService.$inject = [];

	function discService() {

		var service = {
			draw: draw
		};

		var angleSize = 0;
		var discSlices = 20;
		var discRows = 5;
		var disc = [];
		var centerSize = 1;
		var verticalPadding = 20;
		var rad;
		var sliceAngles = [];
		var initialized = false;
		var hoverSample = -1;
		var hoverBeat = -1;
		return service;

		//////////////////////////////////////////////////

		function init(state){
			rad = state.h / 2 - (verticalPadding*2);
			angleSize =  Math.PI * 2 / discSlices;
			for (var i = 0; i < discRows; i++) {
				
				var ring = {
					index: i,
					rad: rad / discRows * (i+1),
					beats: []
				};
				for (var d = 0; d < discSlices; d++) {
					sliceAngles[d] = angleSize * d;
					ring.beats.push ({
						a1: angleSize * d,
						a2: angleSize * (d+1),
						x: state.xCenter + (ring.rad) * Math.cos(angleSize * (d)),
						y: state.yCenter + (ring.rad) * Math.sin(angleSize * (d)),
						active: false
					})
				}
				disc.push(ring);
			}
			sliceAngles[discSlices] = angleSize * (d+1);
			initialized = true;
			console.log(disc);
		}

		function draw(ctx, state) {
			if (!initialized) { init(state); }

			for (var sIndex = 0; sIndex < discSlices; sIndex++) {
				for (var rIndex = 0; rIndex < discRows-1; rIndex++) {

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


					/*if (disc[sInd1].beats[bInd1].active) { // active cell
						ctx.lineWidth = 2;
						ctx.strokeStyle = "#000000";
						ctx.fillStyle = "rgba(100,255,100,0.05)";
					}
					else if (sInd1 == hoverSample && hoverBeat == bInd1) { // hover cell
						ctx.lineWidth = 3;
						ctx.strokeStyle = "#000000";
						ctx.fillStyle = "rgba(100,255,100,0.5)";
					}
					else {
						ctx.lineWidth = 1;
						ctx.strokeStyle = "rgba(0,0,0,0.1)";
					}*/
					ctx.strokeStyle = '#FFFFFF';
					ctx.stroke();
					ctx.closePath();
/*
					//in circles for active cells
					if (disc[sInd1].beats[bInd1].active) {
						var a = (sliceAngles[bInd2] - sliceAngles[bInd1]) * bInd1 + (angleSize/2);
						var r = (disc[sInd1].rad + disc[Sind2].rad)/2;
						ctx.beginPath();
						ctx.lineWidth = 1;
						ctx.strokeStyle = "#FFFFFF";
						ctx.arc(state.xCenter + r * Math.cos(a),state.yCenter + r * Math.sin(a),10,0,Math.PI*2,false);
						ctx.fillStyle = "rgba(100,255,100,0.8)";
						ctx.fill();
						ctx.stroke();
						ctx.closePath();
					}*/
				}
			}
		}
	}
})();