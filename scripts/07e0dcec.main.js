$(function(){"use strict";function a(){b()}function b(){var a=new THREE.WebGLRenderer,b=new THREE.PerspectiveCamera(f,g,h,i),c=new THREE.Scene;b.position.z=300,a.setSize(d,e),j.append(a.domElement);var k=50,l=16,m=16,n=new THREE.SphereGeometry(k,l,m),o=new THREE.MeshPhongMaterial;o.map=THREE.ImageUtils.loadTexture("images/earthmap1k.jpg");var p=new THREE.Mesh(n,o);c.add(p),c.add(b);var q=new THREE.PointLight(16777215);q.position.x=90,q.position.y=110,q.position.z=100,c.add(q);var r=new THREE.AmbientLight(7829367);c.add(r),a.render(c,b),$("canvas").on("mousemove",function(e){p.rotation.y=(e.offsetX-d/2)/260,p.rotation.x=e.offsetY/200,a.render(c,b)}),sense.init().orientation(function(d){p.rotation.x=d.beta/60,p.rotation.y=d.gamma/20,a.render(c,b)})}var c=$(window),d=c.width()||900,e=c.height()||600,f=45,g=d/e,h=.1,i=1e4,j=$("#container");a()});