class CreateColorsTable < ActiveRecord::Migration[5.0]
  def change
  	create_table :colors do |t|
  		t.string :boxColor
  		t.string :bodyColor
  		t.string :btnColor
  		t.string :fontColor
  		t.integer :user_id
  		t.timestamps
  	end
  end
end
