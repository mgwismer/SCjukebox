class AddSongidFieldToSongsTable < ActiveRecord::Migration[5.0]
  def change
  	change_table :songs do |t|
  		t.string :songid
  	end
  end
end
