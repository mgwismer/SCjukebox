require 'sinatra'
require 'SoundCloud'


# register a client with YOUR_CLIENT_ID as client_id_
client = SoundCloud.new(:client_id => ENV['SOUND_CLOUD_API_KEY'])
# get newest tracks
tracks = client.get('/tracks', :limit => 10)	

# print each link
tracks.each do |track|
  puts track.permalink_url
end
get '/' do 
   "Hello World"
end