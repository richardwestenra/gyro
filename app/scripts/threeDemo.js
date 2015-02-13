/* globals THREE */
// jshint devel:true
$(function(){
	'use strict';
	// set the scene size
	var WIDTH = 900,
	HEIGHT = 600;

	// set some camera attributes
	var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 10000;

	// get the DOM element to attach to
	// - assume we've got jQuery to hand
	var $container = $('#container');

	// create a WebGL renderer, camera
	// and a scene
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR  );
	var scene = new THREE.Scene();

	// the camera starts at 0,0,0 so pull it back
	camera.position.z = 300;

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	$container.append(renderer.domElement);

	// create the sphere's material
	// var sphereMaterial = new THREE.MeshLambertMaterial(
	// {
	// 	color: 0xCC0000
	// });


	// set up the sphere vars
	var radius = 50, segments = 16, rings = 16;

	// create a new mesh with sphere geometry -
	// we will cover the sphereMaterial next!
	// var sphere = new THREE.Mesh(
	// 	new THREE.SphereGeometry(
	// 		radius,
	// 		segments,
	// 		rings
	// 	),
	// 	sphereMaterial
	// );

	var geometry   = new THREE.SphereGeometry(radius, segments, rings);
	var material  = new THREE.MeshPhongMaterial();
	material.map = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg');
	var earthMesh = new THREE.Mesh(geometry, material);

	// add the sphere to the scene
	scene.add(earthMesh);
	// scene.add(sphere);

	// and the camera
	scene.add(camera);

	// create a point light
	var pointLight = new THREE.PointLight( 0xFFFFFF );
	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 100;

	// add to the scene
	scene.add(pointLight);

	var light = new THREE.AmbientLight( 0x777777 );
	scene.add(light);

	// draw!
	renderer.render(scene, camera);

	$('canvas').on('mousemove',function(e) {
		pointLight.position.x = e.offsetX - WIDTH/2;
		pointLight.position.y = HEIGHT/2 - e.offsetY;
		earthMesh.rotation.y = (e.offsetX - WIDTH/2) / 100;
		earthMesh.rotation.x = (e.offsetY - WIDTH/2) / 100;
		// camera.rotation.y = ((e.offsetX - WIDTH/2) * (Math.PI / 180)) / 50;
		renderer.render(scene, camera);
	});
	
});