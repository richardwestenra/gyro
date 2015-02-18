//    Copyright (C) 2014 by Marc Planard and Le Cortex
//
//    This file is part of Flappy Space Program.
//
//    Flappy Space Program is free software: you can redistribute it and/or 
//    modify it under the terms of the GNU Affero General Public License as
//    published by the Free Software Foundation, either version 3 of the 
//    License, or (at your option) any later version.
//
//    Flappy Space Program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with Flappy Space Program.  
//    If not, see <http://www.gnu.org/licenses/>.


// jshint loopfunc:true
// jshint unused:false
// jshint devel:true
/* globals flappy, THREE */

$(document).ready(function() {
  'use strict';


  var $indicator = $('<span>')
    .css({
      'position': 'fixed',
      'top': '20px',
      'right': '20px',
      'color': 'white',
      'font-size': '25px'
    })
    .appendTo('body');

  $indicator.text('');

  // var canvas = $('#canvas');
  // var ctx = canvas[0].getContext('2d');
  // var H;
  // var W;


  var geometry, material, mesh,
    onRenderFcts = flappy.onRenderFcts,
    scene = flappy.scene,
    camera = flappy.camera;


  // var mute = false;

  // function play(audio) {
  //   if (mute !== true) {
  //     audio.play();
  //   }
  // }

  // function resize() {
  //   W = $(window).width();
  //   H = $(window).height();

    // $('#canvas').css('width', W);
    // $('#canvas').css('height', H);
    // var ratio = window.devicePixelRatio;
    // W *= ratio;
    // H *= ratio;
    // $('#canvas').attr('width', W);
    // $('#canvas').attr('height', H);

    // ctx.imageSmoothingEnabled = false;
    // ctx.mozImageSmoothingEnabled = false;
    // ctx.webkitImageSmoothingEnabled = false;
    // ctx.msImageSmoothingEnabled = false;
  // }
  // resize();
  // $(window).resize(resize);

  // var sndBoom = new Audio('boom.mp3');
  // var sndGain = new Audio('gain.mp3');
  // var sndMedal = new Audio('medal.mp3');
  

  // var bg = new Image();
  // var sheet = new Image();
  // sheet.onload = function() {
  //   bg.onload = function() {
  //     requestAnimationFrame(run);
  //   }
  //   bg.src = 'bg.png';
  // }
  // sheet.src = 'spritesheet.png';

  // nbr size = 7x10
  // var nbrLst = [
  //   [288, 100], // 0
  //   [289, 118], // 1
  //   [289, 134], // 2
  //   [289, 150], // 3
  //   [287, 173], // 4
  //   [287, 185], // 5
  //   [165, 245], // 6
  //   [175, 245], // 7
  //   [185, 245], // 8
  //   [195, 245] // 9
  // ];
  // function drawNbr(nbr, center) {
    // if (nbr < 0) {
    //   nbr = 0;
    // }
    // var size = 0;
    // for(var n = nbr; n > 0; n /= 10) {
    //   size++;
    //   n = Math.floor(n);
    // }
    // size--;
    // size = Math.max(size, 1);
    // // ctx.save();
    // ctx.scale(2, 2);

    // if (center === true) {
    //   ctx.translate(1 + (8*size), 0);
    // }

    // do {
    //   var a = nbr % 10;
    //   ctx.translate(-16, 0);
    //   ctx.drawImage(sheet, nbrLst[a][0], nbrLst[a][1], 7, 10, 0, -10, 14, 20);
    //   nbr = Math.floor(nbr/10);
    // } while (nbr > 0);

    // ctx.restore();
    // return size;
  // }

  // function drawTitle() {
    // ctx.drawImage(sheet, 344, 134, 79, 44, 0, 0, 79, 44);    
  // }

  // function drawDot() {
    // ctx.drawImage(sheet, 262, 111, 3, 3, -3, -3, 6, 6);    
  // }

  // function drawBigDot() {
    // ctx.drawImage(sheet, 268, 110, 5, 5, -5, -5, 10, 10);    
  // }

  // function drawHelp(time) {

    // if (time % 1 < 0.5 && time % 1 > 0.25) {
    //   ctx.drawImage(sheet, 151, 150, 60, 32, 
    //                 -125, -70, 240, 128);    
    // } else {
    //   ctx.drawImage(sheet, 151, 157, 60, 32, 
    //                 -125, -35, 240, 128);    

    // }
  // }

  // var maxScore=0;
  // var newScore=false;
  // function drawScore(score) {
  //   if (newScore === true && score < maxScore) {
  //     newScore = false;
  //   }
  //   if (score > maxScore) {
  //     newScore = true;
  //     // if ([5, 10, 15, 20].indexOf(score) !== -1) {
  //     //   play(sndMedal);
  //     // } else { 
  //     //   play(sndGain);
  //     // }
  //   }
  //   maxScore = Math.max(score, maxScore);

  //   ctx.drawImage(sheet, 146, 58, 113, 58, 
  //                 -226, 0, 226, 116);    
  //   // ctx.save();
  //   ctx.translate(-20, 45);
  //   ctx.scale(0.5, 0.5);
  //   var size = drawNbr(score, false);
  //   ctx.restore();

  //   // var draw medals
  //   // ctx.save();
  //   ctx.translate(-178, 66);
  //   if (score >= 20) { // platinum
  //     ctx.drawImage(sheet,220, 144, 22, 22, -22, -22, 44, 44);    
  //   } else if (score >= 15) { // gold
  //     ctx.drawImage(sheet,242, 229, 22, 22, -22, -22, 44, 44);
  //   } else if (score >= 10) { // silver
  //     ctx.drawImage(sheet,266, 229, 22, 22, -22, -22, 44, 44);
  //   } else if (score >= 5) { // bronze
  //     ctx.drawImage(sheet,302, 137, 22, 22, -22, -22, 44, 44);
  //   }

  //   ctx.restore();

  //   if (newScore) { // draw NEW
  //     // ctx.save();
  //     ctx.translate(-60 - (size*16), 37);
  //     ctx.drawImage(sheet, 146, 245, 16, 7, 
  //                   0, 0, 32, 14);    
  //     ctx.restore();
  //   }
    
  //   // ctx.save();
  //   ctx.translate(-20, 88);
  //   ctx.scale(0.5, 0.5);
  //   drawNbr(maxScore, false);
  //   ctx.restore();
  // }

  function drawBird(obj, t, alpha) {
    // ctx.save();
    // ctx.translate(alpha*obj.x + (1-alpha)*obj.xPrev, alpha*obj.y + (1-alpha)*obj.yPrev);
    // ctx.rotate(interpolateAngle(obj.aPrev, obj.a, alpha));
    // ctx.translate(-20, -20);

    // $indicator.text(obj.x.toFixed(2) +', '+ obj.y.toFixed(2) +', '+ obj.z.toFixed(2));
    $indicator.text(obj.u.toFixed(2) +', '+ obj.v.toFixed(2) +', '+ obj.a.toFixed(2));

    box.position.set(obj.x, obj.y, obj.z); //nbed
    box.rotation.y = -obj.a;

    // if (obj.dead === true) {
    //   ctx.drawImage(sheet, 171, 119, 20, 20, 0, 0, 40, 40);
    // } else {
    //   if (t % 0.8 < 0.2) {
    //     ctx.drawImage(sheet, 262, 60, 20, 20, 0, 0, 40, 40);
    //   } else if (t % 0.8 < 0.4) {
    //     ctx.drawImage(sheet, 262, 86, 20, 20, 0, 0, 40, 40);
    //   } else if (t % 0.8 < 0.6) {
    //     ctx.drawImage(sheet, 221, 120, 20, 20, 0, 0, 40, 40);
    //   } else {
    //     ctx.drawImage(sheet, 262, 86, 20, 20, 0, 0, 40, 40);
    //   }
    // }
    // ctx.restore();
  }

  var M = 10; // Mass constant??
  var G = 5; // Gravity constant???
  var R = 0.6; // Radius constant?

  // var showHelp = true;

  var FLAP = 0.055; // boost amount

  // birds list(s) and creation / destruction
  var toRemove = [];
  var objList = [];
  var alive = 0;

  var box;

  function newBird() {
    var bird = {
      x : R,
      y : 0,
      z : 0,
      u: 0, // vertical velocity (up)?
      v: 0, // orbital velocity?
      a : -Math.PI/2, // angle?
      t: 0,
      boost: 0,
      dead: false
    };
    bird.xPrev = bird.x;
    bird.zPrev = bird.z;
    bird.aPrev = bird.a;


    var k = 0.1;
    box = new THREE.Mesh(new THREE.BoxGeometry(k*3,k,k), new THREE.MeshLambertMaterial({
      side : THREE.DoubleSide,
      color: 0xFFFF00
    }));
    box.overdraw = true;
    box.position.set(bird.x,bird.y,bird.z);
    scene.add(box);
    
    objList.push(bird);
    return bird;
  }
  var bird = newBird();

  function killBird(obj) {
    // play(sndBoom);

    obj.dead = true;
    obj.u /= 10;
    obj.v /= 10;
    if (obj === bird) {
      bird = newBird();
    }

    // for(var i=0; i < 10; i++) {
    //   var a = Math.random()*Math.PI*2;
    //   var U = (Math.cos(a) * 100 * (Math.random()+1));
    //   var V = (Math.sin(a) * 100 * (Math.random()+1));
      
    //   addPart(obj.x, obj.y, 
    //           U,V,
    //           0.5+Math.random(), 
    //           (Math.random() < 0.5 ? drawDot : drawBigDot));
    // }
    
  }

  // Particles
  // var parts = [];
  // function addPart(x, y, u, v, t, render) {
  //   var p = {
  //     x: x,
  //     y: y,
  //     u: u,
  //     v: v,
  //     t: t,
  //     render: render
  //   };
  //   parts.push(p);
  //   return p;
  // }
  // function stepParts(dt) {
  //   var pToRemove = [];
  //   parts.forEach(function (p) {
  //     p.x += p.u * dt;
  //     p.y += p.v * dt;
  //     p.t -= dt;
  //     if (p.t < 0) {
  //       pToRemove.push(p);
  //     }
  //   });
  //   pToRemove.forEach(function(p) {
  //     if (parts.indexOf(p) !== -1) {
  //       parts.splice(parts.indexOf(p), 1);
  //     }
  //   });
  // }

  function interpolateAngle(a1, a2, alpha) {
    var da = (a2 - a1)%(2*Math.PI);
    if (da > Math.PI) {
      da = da-2*Math.PI;
    } else if (da < -Math.PI) {
      da = da+2*Math.PI;
    }
        
    return a1 + alpha*da;
  }
  
  // distance from 0,0
  function dist(x1, z1) {
    return Math.sqrt((x1*x1)+(z1*z1));
  }

  // Physics
  function grav(obj, dt) {
    obj.xPrev = obj.x;
    obj.zPrev = obj.z;
    obj.aPrev = obj.a;
    
    var d = dist(obj.x, obj.z); // altitude

    var f = G*M/(d*d); // Force  = Gravity * Mass / altitude^2
    obj.f = f;

    var nX = obj.x/d;
    var nZ = obj.z/d;

    obj.u -= nX * f * dt;
    obj.v -= nZ * f * dt;

    // compute angle
    if (obj.dead === true) {
      obj.a += 10*dt;
    } else {
      var A = Math.atan2(obj.z, obj.x);
      
      if (d < R*2) {
        obj.a = A + ((Math.PI/2) * ((d-R)/R));
      } else {
        obj.a = A + (Math.PI/2);
      }
    }

    var X = obj.x + obj.u*dt;
    var Z = obj.z + obj.v*dt;
    var D = dist(X, Z);

    if (D > R) { // not coliding with planet
      obj.x = X;
      obj.z = Z;

      obj.t += dt;

      // if (D > 400 && obj.dead !== true) { // kill if out of range
      //   killBird(obj);
      // }

    } else { // colliding
      obj.x = R*X/D;
      obj.z = R*Z/D;
      obj.u = 0;
      obj.v = 0;

      // remove if not controlled bird
      if (obj !== bird && toRemove.indexOf(obj) === -1) { 
        toRemove.push(obj);
      }

    }
  }

  var oldT = 0;
  var dt = 0;
  function run(now) {
    //while(bird.boost > 0) {      ###
    if (bird.boost === true) {
      // var d = Math.sqrt((bird.u*bird.u)+(bird.v*bird.v));
      bird.u += Math.cos(bird.a) * bird.f * FLAP;// * dt;
      bird.v += Math.sin(bird.a) * bird.f * FLAP;// * dt;
      bird.t = 0;
      bird.boost = false;

      // for(var i=0; i < 10; i++) {
      //   var a = bird.a + ((0.5-Math.random())*0.25);
      //   var U = bird.u - (Math.cos(a) * 100 * (Math.random()+1));
      //   var V = bird.v - (Math.sin(a) * 100 * (Math.random()+1));
        
      //   addPart(bird.x, bird.y, 
      //           U,V,
      //           0.5+Math.random(), 
      //           (Math.random() < 0.5 ? drawDot : drawBigDot));
      // }
    }
    
    if(oldT === 0) {
      oldT = now;
    }
    dt += (now - oldT) / 1000;
    oldT = now;

    var DT = 0.02;
    while(dt > 0) {
      dt -= DT;

      alive = 0;
      objList.forEach(function(o) {
        grav(o, DT);
        
        objList.forEach(function(o2) {
          if (o === o2 || o.dead === true || o2.dead === true) {
            return;
          }
          var d = dist(o.x-o2.x, o.z-o2.z);
          if (d < 20) {
            killBird(o);
            killBird(o2);
          }
        });
        
        if (o.dead !== true && o !== bird) {
          alive++;
        }

      });
      
      toRemove.forEach(function(o) {
        if (objList.indexOf(o) !== -1) {
          objList.splice(objList.indexOf(o), 1);
        }
      });

      // stepParts(DT);
    }

    // if (bird.t > 5.0) { // spawn new bird if last boost > 5 seconds
    //   bird = newBird();
    // }

    // draw blue background and planet
    // ctx.fillStyle = 'rgba(76, 134, 140, 1)'; //'#70c5ce';
    // ctx.fillRect(0, 0, W, H);
   
    // ctx.save();
    // ctx.translate(W/2, H/2);

    // ctx.drawImage(bg, -256, -256, 512, 512);

    // draw particles
    // parts.forEach(function(p) {
    //   // ctx.save();
    //   ctx.translate(p.x + p.u*dt, p.y + p.v*dt);
    //   p.render();
    //   ctx.restore();
    // });

    // draw birds
    objList.forEach(function(o) {
      drawBird(o, now/1000, dt/DT+1);
    });

    // draw altitude limit
    // var N=50;
    // for(var n = 0; n < N; n++) {
    //   // ctx.save();
    //   ctx.rotate(n * (Math.PI*2/N));
    //   ctx.translate(400, 0);
    //   ctx.rotate(-n * (Math.PI*2/N));
    //   if (n%2 === 0) {
    //     drawBigDot();
    //   } else {
    //     drawDot();
    //   }
    //   ctx.restore();
    // }

    // draw fps
    //drawNbr(Math.round(1/dt));

    // if (showHelp) {
    //   drawHelp(now/1000);
    // }

    // ctx.restore(); // stop centering

    // draw score
    // ctx.save();
    // ctx.translate(W-4, 4);
    // drawScore(alive);
    // ctx.restore();

    // draw title
    // ctx.save();
    // ctx.translate(4, 4);
    // ctx.scale(4, 4);
    // drawTitle();
    // ctx.restore();

    requestAnimationFrame(run);
  }

  
  // buffer of 5 'push' sounds because html5 audio is crap!
  // pushes = [];
  // for(var i=0; i < 5; i++) {
  //   var p = new Audio('push.mp3');
  //   pushes.push(p);
  // }

  var push=0;
  function boost() {

    // showHelp = false;

    if (bird.boost !== true) {
      // play(pushes[push]);
      push++;
      if (push >= 5) {
        push = 0;
      }
      bird.boost = true;
    }
    /* cheat for tests
    bird = newBird();
    bird.y = -200;
    bird.u = 250;
    */
  }

  $(document).keydown(boost);
  $('canvas').mousedown(function() {
  	boost();
  	return false;
  });
  //$('#canvas').bind('touchstart', boost);

  // $('#sndOn').click(function() {
  //   $('#music')[0].volume = 0;
  //   mute = true;
  //   $('#sndOn').hide();
  //   $('#sndOff').show();
  // });

  // $('#sndOff').click(function() {
  //   $('#music')[0].volume = 1;
  //   mute = false;
  //   $('#sndOn').show();
  //   $('#sndOff').hide();
  // });

  requestAnimationFrame(run);

});