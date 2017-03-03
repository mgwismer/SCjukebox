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

  function addEventListeners() {
  	var currSong = document.getElementById("currSong-mp3");
  	$('.box-play-btn').click(function() {
  		console.log("play clicked");
  		console.log(currSong);
  		currSong.play();
  	});
  	$('.box-pause-btn').click(function() {
  		currSong.pause();
  	});
  	$('.box-search-btn').click(function(){
  		console.log("search clicked");
  		$('.searchDiv').css('display','block');
  	});
	  $('#searchForm').on('submit', function(e){
      searchCloud(e);
    });
    $('#addSongList').on('submit', function(e){
      searchCloud(e);
    });
  }
 
   function listenToSearch(e) {
  	//selects a song from the searchlist form
  	e.preventDefault();
  	var songURL = $('input[name=songBtn]:checked').val();
    console.log(songURL);
    //I believe the return data is different than the sent data.
	 	$.ajax({
		  type: 'POST',
		  url: '/addSong',
		  dataType: "jsonp",
		  data: {keyword: songURL},
		  success: function(data) {
	    	  console.log(data);
	    	  console.log("success");
	    	  //create the return search list in javascript
	    	  //displaySearchResults(data);
	    },
	    error: function() {
	    	console.log("error");
	    }
		}); 
  }

  function searchCloud(e) {
  	//prevents the form from submitting to the controller in the normal way
    e.preventDefault();
    console.log('button clicked');
    var keyword = $('#inputQuery').val();
    //this is where finds the correct place in sinatra to get the data
    var url = '/searchcloud';
    $('#results').html("Patience my friend");
    readUsingAJAX(url,keyword);	
  }

  function readUsingAJAX(url,keyword) {
		// var d = $.Deferred();
	 	$.ajax({
		  type: 'POST',
		  url: url,
		  dataType: "jsonp",
		  data: {keyword: keyword},
		  success: function(data) {
	    	  console.log(data[1]);
	    	  console.log("success");
	    	  //create the return search list in javascript
	    	  displaySearchResults(data);
	    },
	    error: function() {
	    	console.log("error");
	    }
		}); 
		// setTimeout(function() {
		// 	console.log('3');
	 //  	d.resolve();
		// }, 1000);
		// return d.promise();
  }

  function displaySearchResults(tracks) {
  	$('.searchDiv').css('display','none');
  	var resultsDiv = $('#addSongList');
  	for (var i = 0; i < tracks.length; i++) {
  		$('<input type="radio" name="songBtn"/>').attr(
  			"value",tracks[i].stream_url
			).appendTo(resultsDiv);
			$("<p>"+tracks[i].title+"</p>").appendTo(resultsDiv);
			$("<br>").appendTo(resultsDiv);
  		console.log(tracks[i]);
  	}
  	resultsDiv.append("<input type='submit' value='SUBMIT'>");
    var songURL = $('input[name=songBtn]:checked').val();
    console.log(songURL);
  }
  //Here's the jQuery function to string the functions in order.
  makeBox(10,100,200,450).pipe(makeAntennae).pipe(makeSpeakers);
  addEventListeners();

});