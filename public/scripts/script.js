$(document).ready(function() {
  var pi = 3.14159;
  //plays are pause whatever is the src for the current song. currently the 
  //audio tags is on the home.erb and the src is set with embedded ruby.
  function controlSong() {	  
    console.log("hello from script"); 
		var currSong = document.getElementsByClassName("Song-mp3")[0];
		console.log(currSong);
		var playBtn = document.getElementsByClassName("play-btn")[0];
   	var pauseBtn = document.getElementsByClassName("pause-btn")[0];
   	playBtn.addEventListener("click",function() {
	 		currSong.play(); 
    });
   	pauseBtn.addEventListener("click",function() {
	 		currSong.pause(); 
    });
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

});