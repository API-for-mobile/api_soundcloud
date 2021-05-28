// load the things we need
var mongoose = require('mongoose');

var Track = require('./track')
// define the schema for our user model
var AlbumSchema = mongoose.Schema({
    name: String,
    artist: String,
    listeners: Number,
    playcount: Number,
    tracks: [Track]
},
    {
        timestamps: true,
        versionKey: false
    });

// create the model for users and expose it to our app
module.exports = mongoose.model('album', AlbumSchema);
