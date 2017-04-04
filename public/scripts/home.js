 $(document).ready(function() { 
  var pi = 3.14159;
  function drawLine(x1,y1,x2,y2,ratio) {
    //ctx.fillRect(0,0,300,300);
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }

  function animate(x1,y1,x2,y2,ratio) {
    ratio = ratio || 0;
    x1 = x1 + ratio*(300-x1);
    y1 = 50+50*Math.sin(4*pi*x1/300);
    x2 = x1 + ratio*(300-x1);
    y2 = 50+50*Math.sin(4*pi*x2/300);
    drawLine(x1,y1,x2,y2,ratio);
    if(ratio<1) {
      requestAnimationFrame(function() {
        animate(x1,y1,x2,y2,ratio + 0.001);
      });
    }
  }

  function drawSine() {
    ctx.strokeStyle="black";
    ctx.fillStyle="white";
    animate(0,0,100,100,0);
  }

  var cvs = document.getElementById("canvas1");
  var ctx = cvs.getContext("2d");
  drawSine();
});