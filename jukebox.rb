require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/flash'
require 'SoundCloud'
require './models.rb'
require 'json'
require 'sinatra/jsonp'

ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'] || 'postgres://localhost/myapp_development')
enable :sessions
initColor = {boxColor: "000000", bodyColor: "FFFFFF", btnColor: "000000"}

client = SoundCloud.new(:client_id => ENV['SOUND_CLOUD_API_KEY'])

get '/' do 
	erb :home
end

get '/home' do
	puts "These are my params"
	puts params.inspect
end

#goto the sign up page
get '/signup' do
   erb :signup
end

#goto the login page
get '/loginpage' do
   erb :loginpage
end

post '/users/create' do
  @user= User.new(params)
  @user.save
  session[:user_id] = @user.id
  #default colors
  @color = Color.new(initColor)
  @color.user_id = @user.id
  @color.save
  redirect "/user/#{@user.id}"
end

post '/login' do
  @user = User.find_by(email: params["email"])
  if @user && (@user.password == params['password'])
    session[:user_id] = @user.id
    flash[:notice] = "You got it, you're so  in"
    redirect "/user/#{session[:user_id]}"
  else 
    flash[:alert] = "Nope, try again"
    redirect '/loginpage'
  end
end

get '/logout' do
  if (session[:user_id])
    session[:user_id] = nil 
    erb :loginpage
  else
    erb :loginpage
  end
end

post '/searchcloud', :provides => :json do
	keyword = params[:keyword]
	searchTracks = client.get('/tracks',{q: keyword})
	#check to see if any of these songs are already in the users playlist. Make a hash with the suitable data.
	@returnTracks = checkInPlayList(searchTracks)
	@songs = nil
	JSONP @returnTracks
end

#identifies which of the searched songs are already in users playlist
def checkInPlayList(tracks)
	user = User.find(session[:user_id])
	playlist = user.songs
	mySearchObj = {}
	mySearchArr = []
  tracks.each do |track|
		mySearchObj = {:title => track.title, :songid => track.id }
		if playlist.any?{|song| song.songid.to_i == track.id.to_i}
			mySearchObj[:inPlaylist] = true
		else 
			mySearchObj[:inPlaylist] = false
		end
	  mySearchArr.push(mySearchObj)
	end
  return mySearchArr
end

get '/user/:id' do
  @user = User.find(params["id"])
  @colors = Color.find_by(user_id: @user.id)
  @songs = @user.songs.order("position")
  @myHash = {:songs => @songs, :key => ENV['SOUND_CLOUD_API_KEY']}
  puts @myHash.to_json
 	if (@songs.length == 0)
 	 #if the user playlist is empty, get a random song
 	 @tracks = client.get('/tracks', :limit => 10)
 	 @newtrack = @tracks[1].stream_url<<"?client_id="<<ENV['SOUND_CLOUD_API_KEY']
	else 
	 @newtrack = @songs[0].url_track
	end
  erb :user
end

post '/pickSong', :provides => :json do
	@user = User.find(session[:user_id])
	songID = params[:id]
	playTrack = client.get('/tracks/'<<songID)
	myHash = {:song => playTrack, :key => ENV['SOUND_CLOUD_API_KEY']}
	JSONP myHash
end

post '/deleteSong' do
	songindex = params[:index]
  user = User.find(session[:user_id])
  songid = user.songs[songindex.to_i].songid
  #delete from users playlist
  user.songs = user.songs - [user.songs[songindex.to_i]]
  #remove from database
  song = Song.find_by(songid: songid)
  song.destroy
  JSONP user.songs.order("position")
end

post '/addSong' do
  songID = params[:id]
  user = User.find(session[:user_id])
	songTrack = client.get('/tracks/'<<songID)
	#save the following properties to the playlist
	title = songTrack.title
	artwork = songTrack.artwork_url
	artist = songTrack.permalink_url
	url_track = songTrack.stream_url
	user_id = session[:user_id]
	song = Song.new(title: title, artwork: artwork, artist: artist, url_track: url_track, user_id: user_id, songid: songID)
	song.save
	#is it necessary to return something
  JSONP user.songs.order("position")
end

post '/moveInPlaylist' do
	songindex = params[:index]
  user = User.find(session[:user_id])
  if (params[:direction] == "up")
    user.songs[songindex.to_i].move_higher
  else
  	user.songs[songindex.to_i].move_lower
  end
  JSONP user.songs.order("position")
end
