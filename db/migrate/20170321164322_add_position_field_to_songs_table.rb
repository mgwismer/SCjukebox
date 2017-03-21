class AddPositionFieldToSongsTable < ActiveRecord::Migration[5.0]
  def change
  	change_table :songs do |t|
  		t.integer :position
  	end
  end
end
