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

	function animate(x1,y1,x2,y2,ratio) {
	  ratio = ratio || 0;
	  drawLine(x1,y1,x2,y2,ratio);
	  if(ratio<1) {
	    requestAnimationFrame(function() {
	      animate(x1,y1,x2,y2,ratio + 0.01);
	    });
	  }
	}

	function makeBox(startX, startY, height, width){
	  var d = $.Deferred();
		var endX = startX + width;
		var endY = startY + height;
		animate(startX,startY,startX,endY,0);
		animate(startX,endY,endX,endY,0);
		animate(endX,endY,endX,startY,0);
		animate(endX,startY,startX,startY,0);
	  setTimeout(function() {
	    console.log('1');
	    d.resolve();
	  }, 2000);
	  return d.promise();
	}

	function makeAntennae(){
	  var d = $.Deferred();
		animate(150,100,70,20);
		animate(200,100,280,20);
	  setTimeout(function() {
	    console.log('2');
	    d.resolve();
	  }, 1000);
	  return d.promise();
	}
	// function makeBox(startX, startY, height, width,callback) {
	// 	var endX = startX + width;
	// 	var endY = startY + height;
	// 	animate(startX,startY,startX,endY,0);
	// 	animate(startX,endY,endX,endY,0);
	// 	animate(endX,endY,endX,startY,0);
	// 	animate(endX,startY,startX,startY,0);
	// 	if (typeof callback === 'function') {
	// 		callback();
	// 	}
	// }

	// function makeAntennae() {
	// 	animate(150,100,70,20);
	// 	animate(200,100,280,20);
	// }  

	//should execute makeBox before makeAntennae
	// $.when(makeBox(10,100,200,450)).then(makeAntennae());
	makeBox(10,100,200,450).pipe(makeAntennae);


});