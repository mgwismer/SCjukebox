$(document).ready(function() {
  
  var pi = 3.14159;
  //plays are pause whatever is the src for the current song. currently the 
  //audio tags is on the home.erb and the src is set with embedded ruby.
  function controlSong() {	   
		var currSong = document.getElementsByClassName("Song-mp3")[0];
		console.log(currSong);
		var playBtn = document.getElementsByClassName("play-btn")[0];
   	var pauseBtn = document.getElementsByClassName("pause-btn")[0];
   	playBtn.addEventListener("click",function() {
	 		currSong.play() });
   	pauseBtn.addEventListener("click",function() {
	 		currSong.pause() });
  }

  function setBodyColor(color) {
    document.getElementsByTagName('body')[0].style.backgroundColor = '#'+picker.toString();
  }
  function setH1Color(color) {
    document.getElementById('userH1').style.color = '#'+picker.toString();
  }
  function setTextColor(color) {
    document.getElementsByTagName('body')[0].style.color = '#'+picker.toString();
  } 
  controlSong();
var cvs = document.getElementsByTagName("canvas")[0];
var ctx = cvs.getContext("2d");
ctx.strokeStyle="black";
ctx.fillStyle="white";

function drawLine(x1,y1,x2,y2,ratio) {
  ctx.fillRect(0,0,300,300);
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}

function animate(x1,y1,x2,y2,ratio) {
  ratio = ratio || 0;
  x1 = x1 + ratio*(300-x1);
  y1 = 50+50*Math.sin(2*pi*x1/300);
  x2 = x1 + ratio*(300-x1);
  y2 = 50+50*Math.sin(2*pi*x2/300);
  drawLine(x1,y1,x2,y2,ratio);
  if(ratio<1) {
    requestAnimationFrame(function() {
      animate(x1,y1,x2,y2,ratio + 0.001);
    });
  }
}

animate(0,0,100,100,0);
});