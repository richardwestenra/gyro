// jshint devel:true

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



  
  //--- Gyro detection ---//

  function gyro(){

    // Position Variables
    // var x = 0;
    // var y = 0;
    // var z = 0;

    // Speed - Velocity
    // var vx = 0;
    // var vy = 0;
    // var vz = 0;

    // Acceleration
    var ax = 0;
    var ay = 0;
    var az = 0;
    var ai = 0;
    var arAlpha = 0;
    var arBeta = 0;
    var arGamma = 0;

    var delay = 100;
    // var vMultiplier = 0.01;

    var alpha = 0;
    var beta = 0;
    var gamma = 0;

    window.ondevicemotion = function(event) {
      ax = Math.round(Math.abs(event.accelerationIncludingGravity.x * 1));
      ay = Math.round(Math.abs(event.accelerationIncludingGravity.y * 1));
      az = Math.round(Math.abs(event.accelerationIncludingGravity.z * 1));    
      ai = Math.round(event.interval * 100) / 100;
      var rR = event.rotationRate;

      if (rR !== null) {
        arAlpha = Math.round(rR.alpha);
        arBeta = Math.round(rR.beta);
        arGamma = Math.round(rR.gamma);
      }

      // ax = Math.abs(event.acceleration.x * 1000);
      // ay = Math.abs(event.acceleration.y * 1000);
      // az = Math.abs(event.acceleration.z * 1000);
    };

    window.ondeviceorientation = function(event) {
      alpha = Math.round(event.alpha);
      beta = Math.round(event.beta);
      gamma = Math.round(event.gamma);
    };
      
    function d2h(d) {return d.toString(16);}
    // function h2d(h) {return parseInt(h,16);}
    
    function makecolor(a, b, c) {
      var red = Math.abs(a) % 255;
      var green = Math.abs(b) % 255;
      var blue = Math.abs(c) % 255;
      return '#' + d2h(red) + d2h(green) + d2h(blue);
    }
    
    // function makeacceleratedcolor(a, b, c) {
    //   var red = Math.round(Math.abs(a + az) % 255);
    //   var green = Math.round(Math.abs(b + ay) % 255);
    //   var blue = Math.round(Math.abs(c + az) % 255);
    //   return '#' + d2h(red) + d2h(green) + d2h(blue);
    // }
    
    
    if (window.DeviceMotionEvent===undefined) {
      $('no').show();
      $('yes').hide();
    } else {

      setInterval(function() {
        document.getElementById('xlabel').innerHTML = 'X: ' + ax;
        document.getElementById('ylabel').innerHTML = 'Y: ' + ay;
        document.getElementById('zlabel').innerHTML = 'Z: ' + az;                   
        document.getElementById('ilabel').innerHTML = 'I: ' + ai;                   
        document.getElementById('arAlphaLabel').innerHTML = 'arA: ' + arAlpha;                              
        document.getElementById('arBetaLabel').innerHTML = 'arB: ' + arBeta;
        document.getElementById('arGammaLabel').innerHTML = 'arG: ' + arGamma;                                                  
        document.getElementById('alphalabel').innerHTML = 'Alpha: ' + alpha;
        document.getElementById('betalabel').innerHTML = 'Beta: ' + beta;
        document.getElementById('gammalabel').innerHTML = 'Gamma: ' + gamma;

        document.getElementById('accelcolor').innerHTML = 'Color: ' + makecolor(ax, ay, az);
        document.getElementById('accelcolor').style.background = makecolor(ax, ay, az);
        document.getElementById('accelcolor').style.color = '#FFFFFF';
        document.getElementById('accelcolor').style.fontWeight = 'bold';

        document.getElementById('gyrocolor').innerHTML = 'Color: ' + makecolor(alpha, beta, gamma);
        document.getElementById('gyrocolor').style.background = makecolor(alpha, beta, gamma);
        document.getElementById('gyrocolor').style.color = '#FFFFFF';
        document.getElementById('gyrocolor').style.fontWeight = 'bold';

        document.bgColor = makecolor(arAlpha, arBeta, arGamma);

      }, delay);
    }
  }
  gyro();



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
