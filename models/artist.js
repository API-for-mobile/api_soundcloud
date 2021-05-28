// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var ArtistSchema = mongoose.Schema({
    name: String,
    rank: Number,
    albums: [{
        name: String,
        playcount: Number,
        image: String
    }]
},
    {
        timestamps: true,
        versionKey: false
    });

// create the model for users and expose it to our app
module.exports = mongoose.model('artist', ArtistSchema);
