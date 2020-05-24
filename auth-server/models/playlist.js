const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    user_id : {
        type: String ,
        required : true
    },
    acousticness : {
        type: Number,
        required : true
    },
    danceability : {
        type: Number,
        required : true
    },
    energy : {
        type: Number,
        required : true
    },
    instrumentalness : {
        type: Number,
        required : true
    },
    liveness : {
        type: Number,
        required : true
    },
    loudness : {
        type: Number,
        required : true
    },
    popularity : {
        type: Number,
        required : true
    },
    speechiness : {
        type: Number,
        required : true
    },
    tempo : {
        type: Number,
        required : true
    },
    valence : {
        type: Number,
        required : true
    }

})

var Playlist = mongoose.model('Playlist', PlaylistSchema)

module.exports = Playlist;