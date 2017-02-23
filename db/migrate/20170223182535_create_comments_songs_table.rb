class CreateCommentsSongsTable < ActiveRecord::Migration[5.0]
  def change
  	 create_table :comments_songs do |t|
  	 	t.integer :comment_id
  		t.integer :song_id
  	end
  end
end
