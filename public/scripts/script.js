$(document).ready(function() {

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

  //Creates the list of songs with buttons 
  createList = function(respList) {
    $("#searchlist-div").css("visibility","visible");
    console.log("in createList "+respList.length);
	  for (var i = 0; i < respList.length; i++) {
	     form0 = document.forms[1]
          .appendChild(document.createElement("input"));
       form0.className = "select-btn";
       form0.type = "button";
       form0.value = respList[i].title;
       console.log(i+"form value")
       console.log(form0.value);
       $(form0).click(function(){
          var j = $(this).index();
          addTrack = respList[j].stream_url;
          addName = respList[j].title;
          $(".Song-mp3").attr("src",addTrack+"?client_id=fd4e76fc67798bfa742089ed619084a6");
       })
	   } //end for loop
  }// end createList

  function searchSong() {
  	$(".search-btn").click(function() {

  	})
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