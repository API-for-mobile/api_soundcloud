// load the things we need
var mongoose = require('mongoose');

var Track = require('./track')
// define the schema for our user model
var AlbumSchema = mongoose.Schema({
    name: String,
    artist: String,
    playcount: Number,
    image: String,
    tracks: [{
        id_object: String,
        id: String,
        title: String,
        rank: Number,
        image: String,
        duration: Number,
        media: String,
        description: String,
        username: String,
    }]
},
    {
        timestamps: true,
        versionKey: false
    });

// create the model for users and expose it to our app
module.exports = mongoose.model('album', AlbumSchema);
