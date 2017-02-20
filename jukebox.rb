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
		@tracks = client.get('/tracks', :limit => 10)	
		erb :home
end

#goto the login page
get '/tracks' do
	 @tracks = client.get('/tracks', :limit => 10)	
   erb :home
end