$(document).ready(function(){

  var cvs = document.getElementById("boomBoxCanvas");
  var ctx = cvs.getContext("2d");
  //ratio makes the line shorter unless it is one
	function drawLine(x1,y1,x2,y2,ratio) {
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
  
  //tried to adapt drawLine to drawArc but it does not draw slow
  function drawArc(xcen,ycen,rad,ang1,ang2,ratio) {
	// Drawing a circle the traditional way
		ctx.beginPath();
		ctx.arc(xcen,ycen,rad,ang1,ratio*ang2, true);
		ctx.stroke();
		//ctx.fillStyle = 'rgba(195, 56, 56, 1)';
		// ctx.fill();
		// ctx.closePath();
	}
  
  //slowly draws a line by adding drawing it a little longer each time.
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
  
  //The jQuery Deferred option allows asynchronous functions to 
  //be strung together. something to do with callback and promises.
	function makeBox(startX, startY, height, width){
	  var d = $.Deferred();
		var endX = startX + width;
		var endY = startY + height;
		animateLine(startX,startY,startX,endY,0);
		animateLine(startX,endY,endX,endY,0);
		animateLine(endX,endY,endX,startY,0);
		animateLine(endX,startY,startX,startY,0);
	  setTimeout(function() {
	    d.resolve();
	  }, 2000);
	  return d.promise();
	}

	function makeAntennae(){
	  var d = $.Deferred();
		animateLine(150,100,70,20);
		animateLine(200,100,280,20);
	  setTimeout(function() {
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
	    d.resolve();
	  }, 1000);
	  return d.promise();
	}

  function addEventListeners() {
  	var currSong = document.getElementById("currSong-mp3");
  	$('.box-play-btn').click(function() {
  		currSong.play();
  	});
  	$('.box-pause-btn').click(function() {
  		currSong.pause();
  	});
  	//this button display the search form where user can type in keyword.
  	$('.box-search-btn').click(function(){
  		currSong.pause();
  		clearSearchResults();
  		$('.searchDiv').css('display','block');
  	});
  	$('.box-playlist-btn').click(function(){
  		$('#searchlist-container').css('display','none');
  		$('.playlist-container').css('display','block');
  		if( myBoomBox.changed ){
  			myBoomBox.remakePlaylist();
  		}
  	});
  	//this button submits the keyword to do the search
	  $('#searchForm').on('submit', function(e){
      searchCloud(e);
    });
	  //add is just a button not a submit button.
    $('.box-add-btn').on('click', function(e) {
    	addCurrentSongToPlaylist(e);
    })
    //this is when the radio button is selected and submitted in the search list.
    $('#addSongList').on('submit', function(e){
      listenToSearch(e);
    });
    //these event listeners are a separate function since they are called everytime user deletes from the playlist. 
    addDeleteEventListeners();
    addMoveUpEventListeners();
  }

  function addMoveUpEventListeners() {
  	//a lot of duplication here with addDeleteEventListeners and addMoveDownEventListeners()
  	$(".up-buttons").on('click', function(e) {
  		child = e.target;
  		var i = 0;
      while( (child = child.previousSibling) != null ) {
        i++;  
      }
      console.log(i);
      //need to reorder it on both the back end and the front end. 
      myBoomBox.moveUpInPlaylist(i);
  	});
  }
   
   //Called from remakePlaylist function
   //Note there are multiple deletepost-div divs each one with a button but acting the same as if there was just one div with multiple child buttons.
   function addDeleteEventListeners(){
   	$('.playlist-container').on('click', function(e) {
   		console.log(e);
   		console.log(e.target);
			child = e.target.parentNode.parentNode;
			console.log(child);
			console.log(child.previousElementSibling);
  		var i = 0;
      //find the index of which card clicked by checking how many siblings before it.
      while( (child = child.previousElementSibling) != null )
        i++;
      console.log("delete index "+i)
      myBoomBox.deleteSongFromPlayList(i);
  	});
   }
   //selects a song from the searchlist form
   function listenToSearch(e) {
  	e.preventDefault();
  	//find the radio button that was clicked
  	var songID = parseInt($('input[name=songBtn]:checked').val());
    //I believe the return data is different than the sent data.
	 	$.ajax({
		  type: 'POST',
		  //picks song from the seach list to sample it, before adding to playlist
		  url: '/pickSong',
		  dataType: "jsonp",
		  data: {id: songID},
		  success: function(data) {
	  	  //show song in the boom box
	  	  $('#currSongTitle').html(data.song.title);
	  	  //set the src on the audio for the picked song
    	  $("#currSong-mp3").attr("src",data.song.stream_url+"?client_id="+data.key);
    	  //uncheck the radio button
    	  $('input[name=songBtn]:checked').attr('checked',false);
    	  $('.box-add-btn').css('visibility','visible');
    	  //used to store the id of the current song. I guess this is where the song id is converted to a string.
    	  $('#songID').text(data.song.id);
        document.getElementById("currSong-mp3").play();
	    },
	    error: function() {
	    	console.log("error");
	    }
		}); 
  }

  //result of search button  
  function searchCloud(e) {
  	//prevents the form from submitting to the controller in the normal way
    e.preventDefault();
    //gets the value from the text box.
    var keyword = $('#inputQuery').val();
    readUsingAJAX(keyword);	
  }

  //searches the sound cloud on the backend with a 
  //user supplied keyword.
  function readUsingAJAX(keyword) {
	 	$.ajax({
		  type: 'POST',
		  url: '/searchcloud',
		  dataType: "jsonp",
		  data: {keyword: keyword},
		  //data consists of all the song objects
		  success: function(data) {
	    	  //create the return search list in javascript
	    	  myBoomBox.searchList = data;
	    	  displaySearchResults(data);
	    },
	    error: function() {
	    	console.log("error");
	    }
		}); 
  }

  //gets the tracks returned from ajax and shows them with
  //radio buttons. User can choose to listen to a searched song.
  //click the ADD TO PLAYLIST button to add it to their playlist.
  function displaySearchResults(tracks) {
  	console.log('in search list')
  	console.log(tracks);
    //display the search list
  	$('#searchlist-container').css('display','block');
  	//hide the playlist
  	$('.playlist-container').css('display','none');
  	//seachDiv is the text box to type in a keyword to search for.
  	$('.searchDiv').css('display','none');
  	var resultsDiv = $('#addSongList');
  	for (var i = 0; i < tracks.length; i++) {
  		//the value of the radio button is the song id.
  		$('<input type="radio" name="songBtn"/>').attr(
  			"value",tracks[i].songid
			).appendTo(resultsDiv);
  		//only the title is displayed
			$("<span>"+tracks[i].title+"</span>").appendTo(resultsDiv);
			if (tracks[i].inPlaylist) {
				$("<span class='redfont'> in playlist </span>").appendTo(resultsDiv);
			}
			$("<br>").appendTo(resultsDiv);
  	}
  	resultsDiv.append("<input type='submit' value='SUBMIT'>");
  }

  //removes the searched songs from the addSongList form
  function clearSearchResults() {
  	//for some reason $("#addSongList") is not returning the correct element of the form. Need to remove the elements from the form addSongList. songBtn is the name of the input buttons 
  	x = document.getElementsByName("songBtn")[0];
  	console.log(x)
  	//if the radio buttons exist
  	if (x != undefined) {
  		//y is the parent node which is a form
	  	y = x.parentNode;
	 		while (y.firstChild) {
	      y.removeChild(y.firstChild);
			}
		}
  }

  //This function displays the playlist given an array of songs, with delete and arrow buttons.
  function clearPlayList() {
  	removeDiv('playlist-container');
  }
 
  function removeDiv(divName) {
  	var x = document.getElementsByClassName(divName)[0];
  	while (x.firstChild) {
	    x.removeChild(x.firstChild);
		}
  }

  function addCurrentSongToPlaylist(e) {
  	//this may not be necessary since it is not part of a form
  	e.preventDefault();	
  	var songID = parseInt($('#songID').text());
  	$.ajax({
		  type: 'POST',
		  url: '/addSong',
		  dataType: "jsonp",
		  data: {id: songID},
		  success: function(data) {
		  	myBoomBox.playList = data;
		  	console.log("in addCurrentSongToPlaylist");
		  	console.log(data);
		  	//if the song is added to the playlist it should be removed from the list of searched for songs.
		  	myBoomBox.removeSongFromSearchList(songID);
		  	console.log('success');
	    },
	    error: function() {
	    	console.log("error");
	    	console.log(songID);
	    }
		}); 
		myBoomBox.changed = true;
  }

  var Song = function(songID,title,stream_url,artist) {
  	this.id = songID;
  	this.title = title;
  	this.stream_url = stream_url;
  	this.artist = artist;
  	this.inPlaylist = false;
  }

  var Boombox = function() {
  	this.playList = [];
  	this.searchList = [];
  	this.changed = false;
  	this.createBoomBox = function() {		
		  //Here's the jQuery function to string the functions in order.
		  //Draws the boom box.
		  makeBox(10,100,200,450).pipe(makeAntennae).pipe(makeSpeakers);
		  //The buttons should be inside the boombox.
		  addEventListeners();
  	}

  	this.removeSongFromSearchList = function(songid) {
  		//stack overflow result for finding the index of the song with the id, songid
			index = this.searchList.map(function(e) { 
				return e.songid; }).indexOf(songid);
			//add this song to the playlist
			//this.playList.push(this.searchList[index]);
			console.log(this.playList);
			//remove the song from the search list
  		this.searchList.splice(index,1);
  		//clear the current searchList
  		clearSearchResults();
  		//redisplay the shortened searchList
  		displaySearchResults(this.searchList);
  	}

    this.deleteSongFromPlayList = function(index) {
    	//need to delete from the users playlist on the backend and then remake the playlist.
    	$.ajax({
			  type: 'POST',
			  url: '/deleteSong',
			  dataType: "jsonp",
			  //returns the current playlist
			  data: {index: index},
			  //data consists of all the song objects
			  success: function(data) {
		    	  //create the return play list in javascript
		    	  myBoomBox.playList = data;
		    	  myBoomBox.remakePlaylist();
		    },
		    error: function() {
		    	console.log("from playlist error");
		    }
			}); 
			this.changed = true;
    }

    this.moveUpInPlaylist = function(index) {
    	//need an ajax call to reorder playlist on the backend, a lot of duplication with deleteSongFromPlaylist, just a different URL.
    	console.log("before move");
    	console.log(myBoomBox.playList)
    	$.ajax({
			  type: 'POST',
			  url: '/moveUpInPlaylist',
			  dataType: "jsonp",
			  //returns the current playlist
			  data: {index: index},
			  //data consists of all the song objects
			  success: function(data) {
		    	  //create the return play list in javascript
		    	  myBoomBox.playList = data;
		    	  console.log("after move return");
		    	  console.log(data);
		    	  myBoomBox.remakePlaylist();
		    },
		    error: function() {
		    	console.log("from playlist error");
		    }
			}); 
			this.changed = true;
    }

    this.remakePlaylist = function() {
    	console.log("in remake");
	  	console.log(this.playList);
	  	songs = this.playList;
	  	clearPlayList();
	  	x = $('.playlist-container');
	  	for (var i = 0; i < songs.length; i++) {
	      y = $("<div class='song-div row'> </div>");  		
	  		ytitle = $("<div class='title-div col-md-5'></div>");
	  		ytitle.append("<p>"+songs[i].title+"</p>");
	  		//div container for the delete button
	  		ybtn = $("<div class='deletepost-div col-md-2'</div>");
	  		//the actual button
	  		ybtn.append("<input type='button' value='delete' class='main-delete-btn'><br>");
	  		//div container for the up arrow
	  		y_uparrow = $("<div class='up-buttons col-sm-1'></div");
	  		//the actual arrow
	  		y_uparrow.append("<button class='glyphicon glyphicon-chevron-up'></button>");
	  		//div container for the up arrow
	  		y_dnarrow = $("<div class='down-buttons col-sm-1'></div");
	  		//the actual arrow
	  		y_dnarrow.append("<button class='glyphicon glyphicon-chevron-down'></button>")
	  		y.append(ytitle);
	  		y.append(ybtn);
	  		y.append(y_uparrow);
	  		y.append(y_dnarrow);
	  		y.appendTo(x);
	  	}
	  	addDeleteEventListeners();
	  	addMoveUpEventListeners();
    }
  }

  var myBoomBox = new Boombox();
  myBoomBox.createBoomBox();
});