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
  var renderer, onRenderFcts, scene, camera, geometry, material, mesh,
    W = window.innerWidth,
    H = window.innerHeight;


  //--- Init ---//

  function init(){
    threeDemo();
  }

  //--- Three.js ---//

  function threeDemo(){

    THREEx.Planets.baseURL  = '';

    renderer = new THREE.WebGLRenderer({
      antialias : true
    });
    renderer.setSize(W, H);
    document.body.appendChild( renderer.domElement );
    renderer.shadowMapEnabled = true;
    
    onRenderFcts = [];
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100 );
    camera.position.z = 2;

    // var controls = new THREE.OrbitControls( camera );
    // controls.damping = 0.2;
    // controls.addEventListener('change', function() {
    //   renderer.render( scene, camera );
    // });

    var light = new THREE.AmbientLight( 0x111111 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0x888888, 1 );
    light.position.set(5,0,5);
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
    light.shadowDarkness = 0.6;

    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    


    //--- Add sun ---//

    material = THREEx.createAtmosphereMaterial();
    material.side = THREE.BackSide;
    material.uniforms.glowColor.value.set(0xFFFFFA);
    material.uniforms.coeficient.value = 0.1;
    mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material );
    mesh.position.set(30,0,30);
    mesh.scale.multiplyScalar(3);
    scene.add( mesh );


    //--- added starfield ---//
    
    var starSphere = THREEx.Planets.createStarfield();
    starSphere.scale.multiplyScalar(0.5);
    scene.add(starSphere);



    //--- add an object and make it move ---//

    var satellite = new THREE.Object3D();
    satellite.scale.multiplyScalar(1/90);
    scene.add(satellite);
    var satMaterial = new THREE.MeshLambertMaterial({
      side : THREE.DoubleSide,
      color: 0xEEEEEE
    });

    var k = 1;
    [-k,k].forEach(function(d){
      var plane = new THREE.Mesh(new THREE.PlaneGeometry(k*2,k), satMaterial);
      plane.overdraw = true;
      plane.position.set(d*1.5,0,0);
      plane.castShadow = true;
      satellite.add(plane);
    });

    k = 0.5;
    var box = new THREE.Mesh(new THREE.BoxGeometry(k,k,k), satMaterial);
    box.overdraw = true;
    box.position.set(0,0,0);
    box.castShadow = true;
    satellite.add(box);

    var s = {
      angle: 0,
      altitude: 0.55,
      speed: 3/4
    };
    onRenderFcts.push(function(delta){
      s.angle -= s.speed * delta;
      satellite.position.x = s.altitude * Math.cos(s.angle);
      satellite.position.y = s.altitude * Math.sin(s.angle);
      satellite.position.z = s.altitude * Math.sin(s.angle);
      satellite.rotation.x += s.speed * delta;
      satellite.rotation.z -= s.speed * delta;
      satellite.rotation.y += s.speed * delta;
    });




    //--- add an object and make it move ---//

    // var datGUI = new dat.GUI()

    var containerEarth = new THREE.Object3D();
    containerEarth.rotateZ(-23.4 * Math.PI/180);
    containerEarth.position.z = 0;
    scene.add(containerEarth);
    var moon = { x: 0, y: 0, z: 0, angle: 0, altitude: 3 };
    var moonMesh = THREEx.Planets.createMoon();
    moonMesh.position.set(moon.x, moon.y, moon.z);
    moonMesh.scale.multiplyScalar(1/5);
    moonMesh.receiveShadow = true;
    moonMesh.castShadow = true;
    scene.add(moonMesh);
    onRenderFcts.push(function(delta){
      var orbitSpeed = 1/5;
      moon.angle -= orbitSpeed * delta;
      moon.x = moon.altitude * Math.cos(moon.angle);
      moon.z = moon.altitude * Math.sin(moon.angle);
      moonMesh.position.set(moon.x, moon.y, moon.z);
      moonMesh.rotation.y += orbitSpeed * delta;
    });

    var earthMesh = THREEx.Planets.createEarth();
    earthMesh.receiveShadow = true;
    earthMesh.castShadow = true;
    containerEarth.add(earthMesh);
    onRenderFcts.push(function(delta){
      earthMesh.rotation.y += 1/32 * delta;
    });

    geometry = new THREE.SphereGeometry(0.5, 32, 32);
    material = THREEx.createAtmosphereMaterial();
    material.uniforms.glowColor.value.set(0x339cc9);
    material.uniforms.coeficient.value = 0.8;
    material.uniforms.power.value  = 2.0;
    mesh = new THREE.Mesh(geometry, material );
    mesh.scale.multiplyScalar(1.01);
    containerEarth.add( mesh );
    // new THREEx.addAtmosphereMaterial2DatGui(material, datGUI);

    geometry = new THREE.SphereGeometry(0.5, 32, 32);
    material = THREEx.createAtmosphereMaterial();
    material.side = THREE.BackSide;
    material.uniforms.glowColor.value.set(0x339cc9);
    material.uniforms.coeficient.value = 0.5;
    material.uniforms.power.value  = 22;
    mesh = new THREE.Mesh(geometry, material );
    mesh.scale.multiplyScalar(1.15);
    containerEarth.add( mesh );
    // new THREEx.addAtmosphereMaterial2DatGui(material, datGUI);

    var earthCloud = THREEx.Planets.createEarthCloud();
    earthCloud.receiveShadow = true;
    // earthCloud.castShadow = true;
    containerEarth.add(earthCloud);
    onRenderFcts.push(function(delta){
      earthCloud.rotation.y += 1/20 * delta;   
    });

    // Load Treehouse logo mesh and add it to the scene.
    // var loader = new THREE.JSONLoader();
    // loader.load('scripts/models/treehouse_logo.js', function(geometry){
    //   material = new THREE.MeshLambertMaterial({color: 0x55B663});
    //   var logoMesh = new THREE.Mesh(geometry, material);

    //   var logo = { x: -1, y: 0, z: 0, angle: 0, altitude: 0.7 };
    //   logoMesh.position.set(logo.x, logo.y, logo.z);
    //   logoMesh.scale.multiplyScalar(0.1);
    //   scene.add(logoMesh);

    //   onRenderFcts.push(function(delta){
    //     var orbitSpeed = 1;
    //     logo.angle -= orbitSpeed * delta;
    //     logo.x = logo.altitude * Math.cos(logo.angle);
    //     logo.y = logo.altitude * Math.sin(logo.angle);
    //     logoMesh.position.set(logo.x, logo.y, logo.z);
    //     logoMesh.rotation.x += orbitSpeed * delta;
    //     logoMesh.rotation.z += orbitSpeed * delta * 1/3;
    //   });
    // });



    //--- Camera Controls ---//

    // Rotate on mousemove
    var mouse = {x: 0, y: 0};
    document.addEventListener('mousemove', function(event){
      mouse.x = (event.clientX / window.innerWidth ) - 0.5;
      mouse.y = (event.clientY / window.innerHeight) - 0.5;
    }, false);

    // Rotate using gyros:
    sense.init().orientation(function(d){
      mouse.x = d.gamma / 90;
      mouse.y = (d.beta-90) / 180;
    });

    camera.altitude = 6;
    camera.spin = 10;
    onRenderFcts.push(function(delta){
      var c = camera;
      c.position.y += (mouse.y*5 - c.position.y) * (delta*3);
      c.position.x = c.altitude * Math.cos(mouse.x * c.spin);
      c.position.z = c.altitude * Math.sin(mouse.x * c.spin);
      c.lookAt( scene.position );
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

    window.flappy = {
      onRenderFcts: onRenderFcts,
      scene: scene,
      camera: camera
    };

  }



  //--- Mousewheel zoom ---//

  function onMouseWheel(e) {
    e.preventDefault();
    e.stopPropagation();

    var delta = 0;
    if ( e.wheelDelta !== undefined ) { // WebKit / Opera / Explorer 9
      delta = e.wheelDelta;
    } else if ( e.detail !== undefined ) { // Firefox
      delta = - e.detail;
    }

    var zoomSpeed = 0.2;

    if ( delta > 0 ) {
      camera.altitude += zoomSpeed;
    } else {
      camera.altitude -= zoomSpeed;
    }
    // Min/max altitude
    camera.altitude = Math.max(camera.altitude, 1.2);
    camera.altitude = Math.min(camera.altitude, 30);
  }
  document.addEventListener( 'mousewheel', onMouseWheel, false );
  document.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox




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
