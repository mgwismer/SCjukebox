require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/flash'
require 'SoundCloud'
require './models.rb'
require 'json'
require 'sinatra/jsonp'

set :database, "sqlite3:test.sqlite3"
enable :sessions
initColor = {boxColor: "000000", bodyColor: "FFFFFF", btnColor: "000000"}

# register a client with YOUR_CLIENT_ID as client_id_
client = SoundCloud.new(:client_id => ENV['SOUND_CLOUD_API_KEY'])
# tracks = client.get('/tracks', :limit => 10)
# # print each link
# tracks.each do |track|
#   puts track.permalink_url
# end
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
	puts params
  @user = User.where(email: params['email']).first
  puts "Hello"
  puts @user
  songs = @user.songs
  puts songs[0].songid
  if @user && (@user.password == params['password'])
    session[:user_id] = @user.id
    puts session[:user_id]
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

def checkInPlayList(tracks)
	user = User.find(session[:user_id])
	playlist = user.songs
	puts playlist[0].songid
	puts tracks[0].id
	mySearchObj = {}
	mySearchArr = []
  tracks.each do |track|
		mySearchObj = {:title => track.title, :songid => track.id }
		puts track.id
		puts playlist.any?{|song| song.songid.to_i == track.id.to_i}
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
  @songs = @user.songs
  if (@newtrack == nil)
	 	if (@songs.length == 0)
	 	 #if the user playlist is empty, get a random song
	 	 @tracks = client.get('/tracks', :limit => 10)
	 	 puts tracks
	 	 @newtrack = @tracks[1].stream_url<<"?client_id="<<ENV['SOUND_CLOUD_API_KEY']
		else 
		 @newtrack = @songs[0].url_track<<"?client_id="<<ENV['SOUND_CLOUD_API_KEY']
		end 
  end
  puts @newtrack
 erb :user
end

post '/pickSong', :provides => :json do
	puts session[:user_id]
	@user = User.find(session[:user_id])
	puts params
	songID = params[:id]
	playTrack = client.get('/tracks/'<<songID)
	myHash = {:song => playTrack, :key => ENV['SOUND_CLOUD_API_KEY']}
	JSONP myHash
end

post '/addSong' do
  songID = params[:id]
	songTrack = client.get('/tracks/'<<songID)
	#save the following properties to the playlist
	title = songTrack.title
	artwork = songTrack.artwork_url
	artist = songTrack.permalink_url
	url_track = songTrack.stream_url
	user_id = session[:user_id]
	song = Song.new(title: title, artwork: artwork, artist: artist, url_track: url_track, user_id: user_id, songid: songID)
	song.save
  JSONP songTrack
end
