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

    var delay = 100;

    var alpha = 0;
    var beta = 0;
    var gamma = 0;


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
