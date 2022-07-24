(function () {
	'use strict';
	angular
		.module('animations')
		.factory('animationService', animationService)
		.constant('INPUT_TYPE',{
			MUSIC: 1,
			KM: 2,
			NONE: 3
		});

	animationService.$inject = [
		'INPUT_TYPE',
		'discService',
		'bubbles',
		'circles',
		'crazy',
		'crazyLines',
		'galaxy',
		'lineConnections',
		'lineConnectionsTwo',
		'redElectricity',
		'ring',
		'squares',
		'stopper',
		'tracer',
		'freqScope',
		'triangles',
		'barcode',
		'bars',
		'bumps',
		'circleMountain',
		'circleSpread',
		'circleSides',
		'circleThreads',
		'downwardSpiral',
		'flower',
		'fountain',
		'grid',
		'generativeLines',
		'hexMap',
		'mathMachine',
		'mountains',
		'particleRing',
		'rectangleBlur',
		'spinner',
		'spiralGalaxy',
		'squareJumble',
		'sunAndClouds',
		'tunnel',
		'whirlyParticles',
		'lineClusters',
		'lineConnectionsThree'
	];

	function animationService(
		INPUT_TYPE,
		discService,
		bubbles,
		circles,
		crazy,
		crazyLines,
		galaxy,
		lineConnections,
        lineConnectionsTwo,
		redElectricity,
		ring,
		squares,
		stopper,
		tracer,
		freqScope,
		triangles,
		barcode,
		bars,
		bumps,
		circleMountain,
		circleSpread,
		circleSides,
		circleThreads,
		downwardSpiral,
		flower,
		fountain,
		grid,
		generativeLines,
		hexMap,
		mathMachine,
		mountains,
		particleRing,
		rectangleBlur,
		spinner,
		spiralGalaxy,
		squareJumble,
		sunAndClouds,
		tunnel,
		whirlyParticles,
		lineClusters,
        lineConnectionsThree
	){
		var service =  {
			selectedAnimation: -1,
			animations: [
				{   name: 'Line Connections',
					globalCompositeOperation: 'lighter',
					service: lineConnections,
					msg: 'N/A',
					input: INPUT_TYPE.NONE
				},
                {   name: 'Line Connection funnel',
                    globalCompositeOperation: 'lighter',
                    service: lineConnectionsTwo,
                    msg: 'Move Mouse Around Slowly, Click To Reset!',
                    input: INPUT_TYPE.KM
                },
                {   name: 'Line Connection warp',
                    globalCompositeOperation: 'lighter',
                    service: lineConnectionsThree,
                    msg: 'Move Mouse Around Slowly, Click To Reset!',
                    input: INPUT_TYPE.KM
                },
				{   name: 'Line Clusters',
					globalCompositeOperation: 'lighter',
					service: lineClusters,
					msg: 'Right click to change color scheme.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Disc',
					globalCompositeOperation: 'lighter',
					service: discService,
					msg: 'Move mouse to highlight a cell, and right click to change color scheme.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Red Electricity',
					globalCompositeOperation: 'lighter',
					service: redElectricity,
					msg: 'N/A',
					input: INPUT_TYPE.NONE
				},
				{   name: 'Galaxy',
					globalCompositeOperation: 'lighter',
					service: galaxy,
					msg: 'Mouse move and click.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Squares',
					globalCompositeOperation: 'lighter',
					service: squares,
					msg: 'Speed: mouse distance from center. Keys 1-8 toggle stretching on 4 X/Y points of square.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Ring',
					globalCompositeOperation: 'lighter',
					service: ring,
					msg: 'Distance of mouse to center of screen.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Tracer',
					globalCompositeOperation: 'lighter',
					service: tracer,
					msg: 'Mouse down, drag, and move.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Stopper',
					globalCompositeOperation: 'source-over',
					service: stopper,
					msg: 'Click to increase stopper size. Hold mouse down to prevent stopper shrinking.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Crazy',
					globalCompositeOperation: 'source-over',
					service: crazy,
					msg: 'Mouse down, drag, and move. Then release. Right click to change colors.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Circles',
					globalCompositeOperation: 'source-over',
					service: circles,
					msg: 'Distance of mouse to center of screen.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Crazy Lines',
					globalCompositeOperation: 'source-over',
					service: crazyLines,
					msg: 'Mouse down, drag, and move. Then release.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Bubbles',
					globalCompositeOperation: 'source-over',
					service: bubbles,
					msg: 'Distance of mouse to center of screen.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Freq Scope',
					globalCompositeOperation: 'source-over',
					service: freqScope,
					msg: 'Frequency Scope, basically left = low freq, right = high freq',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Triangles',
					globalCompositeOperation: 'lighter',
					service: triangles,
					msg: 'Speed is determined by mouse distance from center of screen. Right click to change color scheme.',
					input: INPUT_TYPE.KM
				},
				{   name: 'Barcode',
					globalCompositeOperation: 'source-over',
					service: barcode,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Bars',
					globalCompositeOperation: 'source-over',
					service: bars,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Bumps',
					globalCompositeOperation: 'source-over',
					service: bumps,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Circle Mountain',
					globalCompositeOperation: 'source-over',
					service: circleMountain,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Circles Spread',
					globalCompositeOperation: 'lighter',
					service: circleSpread,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Circle Sides',
					globalCompositeOperation: 'source-over',
					service: circleSides,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Circle Threads',
					globalCompositeOperation: 'source-over',
					service: circleThreads,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Downward Spiral',
					globalCompositeOperation: 'source-over',
					service: downwardSpiral,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Flower',
					globalCompositeOperation: 'source-over',
					service: flower,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Fountain',
					globalCompositeOperation: 'source-over',
					service: fountain,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Grid',
					globalCompositeOperation: 'source-over',
					service: grid,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Hex Map',
					globalCompositeOperation: 'source-over',
					service: hexMap,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Math Machine',
					globalCompositeOperation: 'lighter',
					service: mathMachine,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Mountains',
					globalCompositeOperation: 'source-over',
					service: mountains,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Particle Ring',
					globalCompositeOperation: 'source-over',
					service: particleRing,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Rectangle Blur',
					globalCompositeOperation: 'source-over',
					service: rectangleBlur,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Spinner',
					globalCompositeOperation: 'source-over',
					service: spinner,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Spiral Galaxy',
					globalCompositeOperation: 'source-over',
					service: spiralGalaxy,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Square Jumble',
					globalCompositeOperation: 'source-over',
					service: squareJumble,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Sun And Clouds',
					globalCompositeOperation: 'source-over',
					service: sunAndClouds,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Tunnel',
					globalCompositeOperation: 'source-over',
					service: tunnel,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Whirly Particles',
					globalCompositeOperation: 'source-over',
					service: whirlyParticles,
					msg: '',
					input: INPUT_TYPE.MUSIC
				},
				{   name: 'Generative Lines',
					globalCompositeOperation: 'source-over',
					service: generativeLines,
					msg: 'Right click to change color, and move mouse to change stretch point.',
					input: INPUT_TYPE.KM
				}

			]
		};

		service.selectedAnimation = service.animations[1];
		return service;
	}
})();