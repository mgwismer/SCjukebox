$(document).ready(function(){

  var cvs = document.getElementById("boomBoxCanvas");
  var ctx = cvs.getContext("2d");
	function drawLine(x1,y1,x2,y2,ratio) {
	  //ctx.fillRect(0,0,300,300);
	  ctx.beginPath();
	  ctx.moveTo(x1,y1);
	  x2 = x1 + ratio * (x2-x1);
	  y2 = y1 + ratio * (y2-y1);
	  ctx.lineTo(x2,y2);
	  ctx.stroke();
	  // And if we intend to start new things after
	  // this, and this is part of an outline, 
	  // we probably also want a ctx.closePath()
	}
  
  function drawArc(xcen,ycen,rad,ang1,ang2,ratio) {
	// Drawing a circle the traditional way
		ctx.beginPath();
		ctx.arc(xcen,ycen,rad,ang1,ratio*ang2, true);
		ctx.stroke();
		//ctx.fillStyle = 'rgba(195, 56, 56, 1)';
		// ctx.fill();
		// ctx.closePath();
	}

	function animateLine(x1,y1,x2,y2,ratio) {
	  ratio = ratio || 0;
	  drawLine(x1,y1,x2,y2,ratio);
	  if(ratio<1) {
	    requestAnimationFrame(function() {
	      animateLine(x1,y1,x2,y2,ratio + 0.01);
	    });
	  }
	}

	function animateArc(xcen,ycen,rad,ang1,ang2,ratio) {
	  ratio = ratio || 0;
	  drawArc(xcen,ycen,rad,ang1,ang2,ratio);
	  if(ratio<1) {
	    requestAnimationFrame(function() {
	      animateArc(xcen,ycen,rad,ang1,ang2,ratio + 0.01);
	    });
	  }
	}

	function makeBox(startX, startY, height, width){
	  var d = $.Deferred();
		var endX = startX + width;
		var endY = startY + height;
		animateLine(startX,startY,startX,endY,0);
		animateLine(startX,endY,endX,endY,0);
		animateLine(endX,endY,endX,startY,0);
		animateLine(endX,startY,startX,startY,0);
	  setTimeout(function() {
	    console.log('1');
	    d.resolve();
	  }, 2000);
	  return d.promise();
	}

	function makeAntennae(){
	  var d = $.Deferred();
		animateLine(150,100,70,20);
		animateLine(200,100,280,20);
	  setTimeout(function() {
	    console.log('2');
	    d.resolve();
	  }, 1000);
	  return d.promise();
	}

	function makeSpeakers(){
	  var d = $.Deferred();
    //left speaker
    animateArc(110,200,35,0,2*Math.PI,0);
    //right speaker
    animateArc(340,200,35,0,2*Math.PI,0);
	  setTimeout(function() {
	  console.log('3');
	    d.resolve();
	  }, 1000);
	  return d.promise();
	}

	makeBox(10,100,200,450).pipe(makeAntennae).pipe(makeSpeakers);

});