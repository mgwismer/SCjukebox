require 'sinatra'
require 'SoundCloud'

# register a client with YOUR_CLIENT_ID as client_id_
client = SoundCloud.new(:client_id => ENV['SOUND_CLOUD_API_KEY'])
# tracks = client.get('/tracks', :limit => 10)
# # print each link
# tracks.each do |track|
#   puts track.permalink_url
# end
get '/' do 
    # get newest tracks
    "Hello World"
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

get '/search' do
	erb :search
end

post '/searchcloud' do
	keyword = params['keyword']
	@tracks = client.get('/tracks',{q: keyword})
	erb :results
end

post '/addsong' do
	puts params.keys[0]
	newstream = params.keys[0].dup
	puts newstream
	@newtrack = newstream<<"?client_id="<<ENV['SOUND_CLOUD_API_KEY']
	erb :home
end