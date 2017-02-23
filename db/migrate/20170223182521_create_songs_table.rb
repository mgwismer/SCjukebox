class CreateSongsTable < ActiveRecord::Migration[5.0]
  def change
  	create_table :songs do |t|
  		t.string :title
  		t.string :artwork
  		t.string :artist
  		t.string :url_track
  		t.integer :rating
  		t.integer :user_id
  		t.timestamps
  	end
  end
end
