// jshint devel:true
/* globals THREE, THREEx, sense */

$(function(){
	'use strict';



  //--- Helper functions ---//

  // Round to the nearest 2 large digits (e.g. 12345 => 12000)
  // function roundLarge(x) {
  //   for(var i=1000000; i>=10; i=i/10){
  //     if (x>(i*10)) {
  //       return Math.round(x/i)*i;
  //     }
  //   }
  //   return Math.round(x);
  // }
  // // Round to SI prefixes
  // function si(x) {
  //   var n = { 'M': 1000000, 'K': 1000};
  //   for(var key in n){
  //     if (x>n[key]) {
  //       return roundLarge(x) / n[key] + key;
  //     }
  //   }
  //   return Math.round(x);
  // }



  //--- Global variables ---//

  // var $embed = $('#embed');
  // var $window = $(window);

  // Gyro vars:
  // var delay = 100,
  //   alpha = 0,
  //   beta = 0,
  //   gamma = 0;

  // Three vars: 
  // set the scene size
  // var WIDTH = $window.width() || 900,
  //   HEIGHT = $window.height() || 600;

  // set some camera attributes
  // var VIEW_ANGLE = 45,
  //   ASPECT = WIDTH / HEIGHT,
  //   NEAR = 0.1,
  //   FAR = 10000;

  // get the DOM element to attach to - assume we've got jQuery to hand
  // var $container = $('#container');




  //--- Init ---//

  function init(){
    threeDemo();
  }

  //--- Three.js ---//

  function threeDemo(){

    // // create a WebGL renderer, camera
    // // and a scene
    // var renderer = new THREE.WebGLRenderer();
    // var camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
    //   ASPECT,
    //   NEAR,
    //   FAR  );
    // var scene = new THREE.Scene();

    // // the camera starts at 0,0,0 so pull it back
    // camera.position.z = 300;

    // // start the renderer
    // renderer.setSize(WIDTH, HEIGHT);

    // // attach the render-supplied DOM element
    // $container.append(renderer.domElement);

    // // create the sphere's material
    // // var sphereMaterial = new THREE.MeshLambertMaterial(
    // // {
    // //  color: 0xCC0000
    // // });


    // // set up the sphere vars
    // var radius = 50, segments = 16, rings = 16;

    // // create a new mesh with sphere geometry -
    // // we will cover the sphereMaterial next!
    // // var sphere = new THREE.Mesh(
    // //  new THREE.SphereGeometry(
    // //    radius,
    // //    segments,
    // //    rings
    // //  ),
    // //  sphereMaterial
    // // );

    // var geometry  = new THREE.SphereGeometry(radius, segments, rings);
    // var material = new THREE.MeshPhongMaterial();
    // material.map = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg');
    // var earthMesh = new THREE.Mesh(geometry, material);

    // material.bumpMap = THREE.ImageUtils.loadTexture('images/earthbump1k.jpg');
    // material.bumpScale = 0.05;

    // material.specularMap   = THREE.ImageUtils.loadTexture('images/earthspec1k.jpg');
    // material.specular = new THREE.Color('grey');

    // var geometry2  = new THREE.SphereGeometry(radius * 1.01, segments, rings);
    // var material2 = new THREE.MeshPhongMaterial({
    //   // map: new THREE.Texture(canvasCloud),
    //   map: THREE.ImageUtils.loadTexture('images/earthcloudmap.jpg'),
    //   side: THREE.DoubleSide,
    //   opacity: 0.3,
    //   transparent: true,
    //   depthWrite: false
    // });
    // var cloudMesh = new THREE.Mesh(geometry2, material2);
    // earthMesh.add(cloudMesh);


    // // add the sphere to the scene
    // scene.add(earthMesh);
    // // scene.add(sphere);

    // // and the camera
    // scene.add(camera);

    // // create a point light
    // var pointLight = new THREE.PointLight( 0xFFFFFF );
    // // set its position
    // pointLight.position.x = 90;
    // pointLight.position.y = 110;
    // pointLight.position.z = 100;

    // // add to the scene
    // scene.add(pointLight);

    // var light = new THREE.AmbientLight( 0x777777 );
    // scene.add(light);

    // // draw!
    // renderer.render(scene, camera);




    THREEx.Planets.baseURL  = '../bower_components/threex.planets/';

    var renderer = new THREE.WebGLRenderer({
      antialias : true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.shadowMapEnabled = true;
    
    var onRenderFcts= [];
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100 );
    camera.position.z = 1;

    var light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set(5,5,5);
    scene.add( light );
    light.castShadow = true;
    light.shadowCameraNear = 0.01;
    light.shadowCameraFar = 15;
    light.shadowCameraFov = 45;

    light.shadowCameraLeft = -1;
    light.shadowCameraRight =  1;
    light.shadowCameraTop =  1;
    light.shadowCameraBottom = -1;
    // light.shadowCameraVisible = true;

    light.shadowBias = 0.001;
    light.shadowDarkness = 0.2;

    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    


    //--- added starfield ---//
    
    var starSphere = THREEx.Planets.createStarfield();
    scene.add(starSphere);



    //--- add an object and make it move ---//

    // var datGUI = new dat.GUI()

    var containerEarth = new THREE.Object3D();
    containerEarth.rotateZ(-23.4 * Math.PI/180);
    containerEarth.position.z = 0;
    scene.add(containerEarth);
    var moonMesh = THREEx.Planets.createMoon();
    moonMesh.position.set(0.5,0.5,0.5);
    moonMesh.scale.multiplyScalar(1/5);
    moonMesh.receiveShadow = true;
    moonMesh.castShadow = true;
    containerEarth.add(moonMesh);

    var earthMesh = THREEx.Planets.createEarth();
    earthMesh.receiveShadow = true;
    earthMesh.castShadow = true;
    containerEarth.add(earthMesh);
    onRenderFcts.push(function(delta){
      earthMesh.rotation.y += 1/32 * delta;
    });

    var geometry = new THREE.SphereGeometry(0.5, 32, 32);
    var material = THREEx.createAtmosphereMaterial();
    material.uniforms.glowColor.value.set(0x00b3ff);
    material.uniforms.coeficient.value = 0.8;
    material.uniforms.power.value  = 2.0;
    var mesh = new THREE.Mesh(geometry, material );
    mesh.scale.multiplyScalar(1.01);
    containerEarth.add( mesh );
    // new THREEx.addAtmosphereMaterial2DatGui(material, datGUI);

    geometry = new THREE.SphereGeometry(0.5, 32, 32);
    material = THREEx.createAtmosphereMaterial();
    material.side = THREE.BackSide;
    material.uniforms.glowColor.value.set(0x00b3ff);
    material.uniforms.coeficient.value = 0.5;
    material.uniforms.power.value  = 4.0;
    mesh = new THREE.Mesh(geometry, material );
    mesh.scale.multiplyScalar(1.15);
    containerEarth.add( mesh );
    // new THREEx.addAtmosphereMaterial2DatGui(material, datGUI);

    var earthCloud = THREEx.Planets.createEarthCloud();
    earthCloud.receiveShadow = true;
    earthCloud.castShadow = true;
    containerEarth.add(earthCloud);
    onRenderFcts.push(function(delta){
      earthCloud.rotation.y += 1/8 * delta;   
    });



    //--- Camera Controls ---//

    var mouse = {x : 0, y : 0};
    document.addEventListener('mousemove', function(event){
      mouse.x = (event.clientX / window.innerWidth ) - 0.5;
      mouse.y = (event.clientY / window.innerHeight) - 0.5;
    }, false);
    onRenderFcts.push(function(delta){
      camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3);
      camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3);
      camera.lookAt( scene.position );
    });




    //--- render the scene ---//

    onRenderFcts.push(function(){
      renderer.render( scene, camera );
    });
    


    //--- loop runner ---//

    var lastTimeMsec= null;
    requestAnimationFrame(function animate(nowMsec){
      // keep looping
      requestAnimationFrame( animate );
      // measure time
      lastTimeMsec = lastTimeMsec || nowMsec-1000/60;
      var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
      lastTimeMsec = nowMsec;
      // call each update function
      onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/1000, nowMsec/1000);
      });
    });





    //--- Rotate on mousemove ---//

    $('canvas').on('mousemove',function(e) {
      console.log(e);
      // pointLight.position.x = e.offsetX - WIDTH/2;
      // pointLight.position.y = HEIGHT/2 - e.offsetY;
      // earthMesh.rotation.y = (e.offsetX - WIDTH/2) / 260;
      // earthMesh.rotation.x = (e.offsetY) / 200;
      // // camera.rotation.y = ((e.offsetX - WIDTH/2) * (Math.PI / 180)) / 50;
      // renderer.render(scene, camera);
    });



    //--- Rotate using gyros ---//

    sense.init().orientation(function(d){
      console.log(d);
      // earthMesh.rotation.x = d.beta / 60;
      // earthMesh.rotation.y = d.gamma / 20;
      // renderer.render(scene, camera);
    });

  }



  //--- Embed button ---//

  // $('.embedLink').on('click',function(e) {
  //   e.preventDefault();
  //   if ($embed.hasClass('visible')) {
  //     $embed.animate({bottom:'-200px'},'slow').fadeOut({queue:false}).removeClass('visible');
  //   } else {
  //     $embed.animate({bottom:'0px'},'slow').fadeIn({queue:false}).addClass('visible');
  //   }
  // });



  //--- Reformat counter share number ---//
  
  // $('.social-likes').socialLikes().on('counter.social-likes', function(event, service, number) {
  //   if(number > 0){
  //     $('.social-likes__counter_'+service).text( si(number) );
  //   }
  // });


  init();

});



//--- Add Linkedin to Social Likes ---//

// var socialLikesButtons = { // must be global because plugin requires it
//   linkedin: {
//     counterUrl: 'http://www.linkedin.com/countserv/count/share?url={url}',
//     counter: function(jsonUrl, deferred) {
//       'use strict';
//       var options = socialLikesButtons.linkedin;
//       if (!options._) {
//         options._ = {};
//         if (!window.IN) {
//           window.IN = {Tags: {}};
//         }
//         window.IN.Tags.Share = {
//           handleCount: function(params) {
//             var jsonUrl = options.counterUrl.replace(/{url}/g, encodeURIComponent(params.url));
//             options._[jsonUrl].resolve(params.count);
//           }
//         };
//       }
//       options._[jsonUrl] = deferred;
//       $.getScript(jsonUrl)
//       .fail(deferred.reject);
//     },
//     popupUrl: 'http://www.linkedin.com/shareArticle?mini=false&url={url}&title={title}',
//     popupWidth: 650,
//     popupHeight: 500
//   }
// };
