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

// NBED
var doOnce = true;
var yellow = 0xFFFF00;
var red = 0xFF0000;


$(document).ready(function() {
  'use strict';

  // Constants:
  var M = 4; // Mass constant??
  var G = 10; // Gravity constant???
  var R = 0.6; // Radius constant?
  var FLAP = 0.08; // boost amount

  // birds list(s) and creation / destruction
  var toRemove = [];
  var objList = [];
  var alive = 0;

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


  var geometry, material, mesh,
    onRenderFcts = flappy.onRenderFcts,
    scene = flappy.scene,
    camera = flappy.camera;

  function drawBird(obj) { // prev args: t, alpha
    // ctx.translate(alpha*obj.x + (1-alpha)*obj.xPrev, alpha*obj.y + (1-alpha)*obj.yPrev);
    // ctx.rotate(interpolateAngle(obj.aPrev, obj.a, alpha));
    // ctx.translate(-20, -20);

    // $indicator.text(obj.x.toFixed(2) +', '+ obj.y.toFixed(2) +', '+ obj.z.toFixed(2));
    // $indicator.text(alpha +', '+obj.u.toFixed(2) +', '+ obj.v.toFixed(2) +', '+ obj.a.toFixed(2));

    obj.el.position.set(obj.x, obj.y, -obj.z); //nbed
    obj.el.rotation.y = obj.a;
  }

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
      dead: false,
      el: null
    };
    bird.xPrev = bird.x;
    bird.zPrev = bird.z;
    bird.aPrev = bird.a;


    var k = 0.1;
    bird.el = new THREE.Mesh(new THREE.BoxGeometry(k*3,k,k), new THREE.MeshLambertMaterial({
      side : THREE.DoubleSide,
      color: yellow
    }));
    bird.el.overdraw = true;
    bird.el.position.set(bird.x,bird.y,bird.z);
    scene.add(bird.el);
    
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
  }

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

      // if (D > R*4 && obj.dead !== true) { // kill if out of range
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

  function run(dt, now) {
    //while(bird.boost > 0) {      ###
    if (bird.boost === true) {
      // var d = Math.sqrt((bird.u*bird.u)+(bird.v*bird.v));
      bird.u += Math.cos(bird.a) * bird.f * FLAP;// * dt;
      bird.v += Math.sin(bird.a) * bird.f * FLAP;// * dt;
      bird.t = 0;
      bird.boost = false;
    }
    now = now*1000;
    
    // if (doOnce) {
    //   console.log(delta, dt);
    //   doOnce = false;
    // }

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
          if (d < 0.2) {
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
          scene.remove(o.el);
          objList.splice(objList.indexOf(o), 1);
        }
      });
    }

    if (bird.t > 2.0) { // spawn new bird if last boost > 5 seconds
      bird = newBird();
    }

    // draw birds
    objList.forEach(function(o) {
      drawBird(o, now/1000, dt/DT+1);
    });
  }

  var push=0;
  function boost() {

    doOnce = true; //nbed

    // showHelp = false;

    if (bird.boost !== true) {
      // play(pushes[push]);
      push++;
      if (push >= 5) {
        push = 0;
      }
      bird.boost = true;
      bird.el.material.color.setHex(red);
    }
    /* cheat for tests */
    // bird = newBird();
    // bird.y = -200;
    // bird.u = 250; 
  }

  function boostEnd(){
    bird.el.material.color.setHex(yellow);
  }

  $(document)
    .on('keydown',boost)
    .on('mousedown',boost)
    .on('keyup',boostEnd)
    .on('mouseup',boostEnd);


  onRenderFcts.push(function(delta, now){
    run(delta, now);
  });

});