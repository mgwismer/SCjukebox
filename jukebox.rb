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