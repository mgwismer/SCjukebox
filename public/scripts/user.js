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

	function animate(ratio) {
	  ratio = ratio || 0;
	  drawLine(0,0,300,300,ratio);
	  if(ratio<1) {
	    requestAnimationFrame(function() {
	      animate(ratio + 0.01);
	    });
	  }
	}
	animate();
	console.log("END ANIMATE");
});