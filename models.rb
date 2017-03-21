class User < ActiveRecord::Base
	has_many :comments
	has_many :songs, {order("position ASC")}
	has_many :colors
end

class Song < ActiveRecord::Base
	belongs_to :user
	acts_as_list :scope, :user
	has_and_belongs_to_many :comments
end

class Comment < ActiveRecord::Base
	belongs_to :user
	has_and_belongs_to_many :songs
end

class Color < ActiveRecord::Base
	belongs_to :user
end