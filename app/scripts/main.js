// jshint devel:true
/* globals THREE */

$(function(){
	'use strict';



  //--- Helper functions ---//

  // Round to the nearest 2 large digits (e.g. 12345 => 12000)
  function roundLarge(x) {
    for(var i=1000000; i>=10; i=i/10){
      if (x>(i*10)) {
        return Math.round(x/i)*i;
      }
    }
    return Math.round(x);
  }
  // Round to SI prefixes
  function si(x) {
    var n = { 'M': 1000000, 'K': 1000};
    for(var key in n){
      if (x>n[key]) {
        return roundLarge(x) / n[key] + key;
      }
    }
    return Math.round(x);
  }



  //--- Global variables ---//

  var $embed = $('#embed');

  // Gyro vars:
  var delay = 100,
    alpha = 0,
    beta = 0,
    gamma = 0;

  // Three vars: 
  // set the scene size
  var WIDTH = 900,
    HEIGHT = 600;

  // set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

  // get the DOM element to attach to - assume we've got jQuery to hand
  var $container = $('#container');




  //--- Init ---//

  function init(){
    gyro();
    threeDemo();
  }


  
  //--- Gyro detection ---//

  function gyro(){

    function left(n, k) {
      k = k || 50;
      return (n * k)+ 'px' ;
    }
    function z(n) {
      n = (n / 360) || 0;
      return left(n);
    }
    function x(n) {
      n = (n / 180) || 0;
      return left(n);
    }
    function y(n) {
      n = (n / 90) || 0;
      return left(n);
    }

    window.ondeviceorientation = function(event) {
      alpha = Math.round(event.alpha);
      beta = Math.round(event.beta);
      gamma = Math.round(event.gamma);
    };
      
    
    if (window.DeviceMotionEvent===undefined) {

      $('<p>',{
        class: 'browsehappy',
        text: 'Your browser does not support Device Orientation and Motion API. Try this sample with iPhone, iPod or iPad with iOS 4.2+.'
      }).prependTo('body');

    } else {

      setInterval(function() {

        $('#values').text('Alpha: ' + alpha +', Beta: ' + beta + ', Gamma: ' + gamma);

        $('#alpha')
          .text('Alpha: ' + alpha)
          .css({
            'left': z(alpha,100)
          });

        $('#beta')
          .text('Beta: ' + beta)
          .css({
            'left': x(beta)
          });

        $('#gamma')
          .text('Gamma: ' + gamma)
          .css({
            'left': y(gamma)
          });

      }, delay);

    }
  }

  //--- Three.js ---//

  function threeDemo(){

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
    //  color: 0xCC0000
    // });


    // set up the sphere vars
    var radius = 50, segments = 16, rings = 16;

    // create a new mesh with sphere geometry -
    // we will cover the sphereMaterial next!
    // var sphere = new THREE.Mesh(
    //  new THREE.SphereGeometry(
    //    radius,
    //    segments,
    //    rings
    //  ),
    //  sphereMaterial
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

  }



  //--- Embed button ---//

  $('.embedLink').on('click',function(e) {
    e.preventDefault();
    if ($embed.hasClass('visible')) {
      $embed.animate({bottom:'-200px'},'slow').fadeOut({queue:false}).removeClass('visible');
    } else {
      $embed.animate({bottom:'0px'},'slow').fadeIn({queue:false}).addClass('visible');
    }
  });



  //--- Reformat counter share number ---//
  
  $('.social-likes').socialLikes().on('counter.social-likes', function(event, service, number) {
    if(number > 0){
      $('.social-likes__counter_'+service).text( si(number) );
    }
  });


  init();

});



//--- Add Linkedin to Social Likes ---//

var socialLikesButtons = { // must be global because plugin requires it
  linkedin: {
    counterUrl: 'http://www.linkedin.com/countserv/count/share?url={url}',
    counter: function(jsonUrl, deferred) {
      'use strict';
      var options = socialLikesButtons.linkedin;
      if (!options._) {
        options._ = {};
        if (!window.IN) {
          window.IN = {Tags: {}};
        }
        window.IN.Tags.Share = {
          handleCount: function(params) {
            var jsonUrl = options.counterUrl.replace(/{url}/g, encodeURIComponent(params.url));
            options._[jsonUrl].resolve(params.count);
          }
        };
      }
      options._[jsonUrl] = deferred;
      $.getScript(jsonUrl)
      .fail(deferred.reject);
    },
    popupUrl: 'http://www.linkedin.com/shareArticle?mini=false&url={url}&title={title}',
    popupWidth: 650,
    popupHeight: 500
  }
};
