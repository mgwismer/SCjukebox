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
  		console.log("search clicked");
  		$('.searchDiv').css('display','block');
  	});
  	$('.box-playlist-btn').click(function(){
  		$('.searchlist-container').css('display','none');
  		$('.playlist-container').css('display','block');
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
  }
 
    //selects a song from the searchlist form
   function listenToSearch(e) {
  	e.preventDefault();
  	//find the radio button that was clicked
  	var songID = $('input[name=songBtn]:checked').val();
    //I believe the return data is different than the sent data.
	 	$.ajax({
		  type: 'POST',
		  url: '/pickSong',
		  dataType: "jsonp",
		  data: {id: songID},
		  success: function(data) {
		  	  //show song in the boom box
		  	  $('#currSongTitle').html(data.song.title);
	    	  $("#currSong-mp3").attr("src",data.song.stream_url+"?client_id="+data.key);
	    	  //uncheck the radio button
	    	  $('input[name=songBtn]:checked').attr('checked',false);
	    	  $('.box-add-btn').css('visibility','visible');
	    	  //used to store the id of the current song.
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
	    	  myBoomBox.updateSearchList(data);
	    	  console.log('search data');
	    	  console.log(data);
	    	  // displaySearchResults(data);
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
    //display the search list
  	$('.searchlist-container').css('display','block');
  	console.log('show search list');
  	console.log(tracks);
  	console.log(tracks.length);
  	//hide the playlist
  	$('.playlist-container').css('display','none');
  	//seachDiv is the text box to type in a keyword to search for.
  	$('.searchDiv').css('display','none');
  	var resultsDiv = $('#addSongList');
  	for (var i = 0; i < tracks.length; i++) {
  		$('<input type="radio" name="songBtn"/>').attr(
  			"value",tracks[i].id
			).appendTo(resultsDiv);
			$("<p>"+tracks[i].title+"</p>").appendTo(resultsDiv);
			$("<br>").appendTo(resultsDiv);
  	}
  	resultsDiv.append("<input type='submit' value='SUBMIT'>");
  }

  function addCurrentSongToPlaylist(e) {
  	//this may not be necessary since it is not part of a form
  	e.preventDefault();	
  	var songID = $('#songID').text();
  	$.ajax({
		  type: 'POST',
		  url: '/addSong',
		  dataType: "jsonp",
		  data: {id: songID},
		  success: function(data) {
		  	//if the song is added to the playlist it should be removed from the list of searched for songs.
		  	myBoomBox.removeSongFromSearchList(songID);
		  	console.log('success');
	    },
	    error: function() {
	    	console.log("error");
	    	console.log(songID);
	    }
		}); 
  }

  function arrayObjectIndexOf(myArray, searchTerm, property) { 
  	console.log(searchTerm);    
  	for(var i = 0, len = myArray.length; i < len; i++) { 
  	  console.log(myArray[i][property]);   
			if (myArray[i][property] === searchTerm) 
				return i;     
		}     
		return -1; 
  }

  var Song = function(songID,title,stream_url,artist) {
  	this.id = songID;
  	this.title = title;
  	this.stream_url = stream_url;
  	this.artist = artist;
  }

  var Boombox = function() {
  	this.playList = [];
  	this.searchList = [];
  	this.createBoomBox = function() {		
		  //Here's the jQuery function to string the functions in order.
		  //Draws the boom box.
		  makeBox(10,100,200,450).pipe(makeAntennae).pipe(makeSpeakers);
		  //The buttons should be inside the boombox.
		  addEventListeners();
  	}
  	this.updateSearchList = function(songs) {
  		for (var i = 0; i < songs.length; i++) {
  			songID = songs[i].id;
  			title = songs[i].title;
  			stream_url = songs[i].stream_url;
  			artist = songs[i].permalink;
  			var song = new Song(songID,title,stream_url,artist);
				this.searchList.push(song);  			
  		}
  		//display the search results on the page
      displaySearchResults(this.searchList);  
  	}

  	this.removeSongFromSearchList = function(songid) {
  		//stack overflow result for finding the index of the song with the id, songid
  		console.log(typeof(songid));
  		console.log(typeof(this.searchList[1].id));
  		//e.id is a number (not sure why) but songid is a string. 
			// index = this.searchList.map(function(e) { 
			// 	return e.id; }).indexOf(songid);
			index = arrayObjectIndexOf(this.searchlist, songid, 'id');
			//remove the song from the search list
  		this.searchList.splice(index,1);
  		//redisplay the shortened searchList
  		displaySearchResults(this.searchList);
  	}
  }
  var myBoomBox = new Boombox();
  myBoomBox.createBoomBox();
});