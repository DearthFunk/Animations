(function () {
	'use strict';
	angular
		.module('animations')
		.factory('lineConnectionsTwo', lineConnectionsTwo);

    lineConnectionsTwo.inject = [];

	function lineConnectionsTwo() {

		var service = {
			mouseDownEvent: mouseDownEvent,
			draw: draw
		};

        var lineFlux = 50;
		var initialized = false;
        var twoPI = Math.PI * 2;
		var galaxyStars = [];
		var galaxyTotalStars = 700;
		var speed = 0.7;
		var mouseDrawRadius = 300;

		return service;

		///////////////////////////////////////

		function mouseDownEvent(e, state) {
            initialized = false;
            galaxyStars = [];
		}

		function newStar(state, comInFromEdgeOfScreen){
            return {
                x: Math.random() * state.w,
				y: Math.random() * state.h,
                dx: Math.random() * speed * (Math.random() >= 0.5 ? -1 : 1),
                dy: Math.random() * speed * (Math.random() >= 0.5 ? -1 : 1),
                vx: 0, //velocity to be used in mouseDraw
                vy: 0, //velocity to be used in mouseDraw
                size: Math.random() + 0.01,
				color: (Math.random() >= 0.5) ? '#FFFF00' : '#FFFFFF'
            }
		}

		function initializeDots(state){
            initialized = true;
            for (var i = 0; i < galaxyTotalStars; i++) {
                galaxyStars.push(newStar(state, false));
            }
		}

		function draw(ctx, state) {
			if (!initialized) { initializeDots(state); }

			// draw dots
			ctx.clearRect(0,0,state.w, state.h);

            var p1 = galaxyStars[0];
			for (var i = 0; i < galaxyStars.length; i++) {
				var star = galaxyStars[i];
                ctx.fillStyle = star.color;
				var drawStar = true;
                var d = Math.sqrt( Math.pow(p1.x - star.x, 2) + Math.pow(p1.y - star.y, 2) );

				// center mouse star
                if (i === 0) {
                    star.x = state.mouseX;
                    star.y = state.mouseY;
                }
                //star is within the radius of effect
                else if (d < mouseDrawRadius) {
                    var speedAdjust = mouseDrawRadius * 0.005 - ((mouseDrawRadius - d) * 0.0003);
                	var dx = (p1.x - star.x) / d * speedAdjust;
                	var dy = (p1.y - star.y) / d * speedAdjust;

                	if (d < 5){
                        galaxyStars[i] = newStar(state, true);
						drawStar = false;
					}
					else {
                        star.x += dx;
                        star.y += dy;
					}
				}
				//normal star
				else {
                    star.x += star.dx;
                    star.y += star.dy;
                }



                if (drawStar) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, twoPI, true);
                    ctx.fill();
                    ctx.closePath();

                    //bounce off wall
                    if (star.x > state.w || star.x < 0) { star.dx *= -1; }
                    if (star.y > state.h || star.y < 0) { star.dy *= -1; }
                }

            }

			// draw lines
            for (var a = 0; a < galaxyStars.length; a++) {
                var p1 = galaxyStars[a];
                for (var b = a; b < galaxyStars.length; b++) {
                    var p2 = galaxyStars[b];
                    var d = Math.sqrt( Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) );
                    if (d < lineFlux) {

                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(255,0,0,' + d/lineFlux + ')';
                        ctx.lineWidth = 1 - (d/lineFlux);

                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
		}
	}
})();