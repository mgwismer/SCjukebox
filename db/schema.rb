# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170223182558) do

  create_table "colors", force: :cascade do |t|
    t.string   "boxColor"
    t.string   "bodyColor"
    t.string   "btnColor"
    t.string   "fontColor"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comments", force: :cascade do |t|
    t.string  "title"
    t.integer "user_id"
  end

  create_table "comments_songs", force: :cascade do |t|
    t.integer "comment_id"
    t.integer "song_id"
  end

  create_table "songs", force: :cascade do |t|
    t.string   "title"
    t.string   "artwork"
    t.string   "artist"
    t.string   "url_track"
    t.integer  "rating"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.text   "password"
    t.text   "bio"
  end

end