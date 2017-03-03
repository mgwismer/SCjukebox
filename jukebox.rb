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
	 @tracks = client.get('/tracks', :limit => 10)
	 @newtrack = @tracks[1].stream_url<<"?client_id="<<ENV['SOUND_CLOUD_API_KEY']
	erb :home
end

#goto the login page
get '/tracks' do
	 @tracks = client.get('/tracks', :limit => 10)
	 @newtrack = @tracks[1].stream_url<<"?client_id="<<ENV['SOUND_CLOUD_API_KEY']	
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

post '/login' do
  @user = User.where(email: params['email']).first
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
  #@user = User.find(params["id"])
	keyword = params[:keyword]
	puts keyword
	searchTracks = client.get('/tracks',{q: keyword})
	#puts @searchTracks
	@songs = nil
	@returnTracks = searchTracks
	JSONP @returnTracks
end

get '/user/:id' do
  @user = User.find(params["id"])
  @colors = Color.find_by(user_id: @user.id)
  @songs = @user.songs
  #This necessary in case user does not have any songs, do
  #not want to through an error. 
  if (@newtrack == nil)
	 	if (@songs.length == 0)
	 	 @tracks = client.get('/tracks', :limit => 10)
	 	 @newtrack = @tracks[1].stream_url<<"?client_id="<<ENV['SOUND_CLOUD_API_KEY']	
		else 
		 @newtrack = @songs[0]
		end 
  end
  puts @newtrack
 erb :user
end

post '/addsong' do
	@user = User.find(session[:user_id])
	puts params
	#newstream = params.keys[0].dup
	newstream = params[:keyword]
	puts newstream
	@newtrack = newstream<<"?client_id="<<ENV['SOUND_CLOUD_API_KEY']
	JSONP @newtrack
end