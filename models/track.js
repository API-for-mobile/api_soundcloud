// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var TrackSchema = mongoose.Schema(
    {
        id_object: String,
        id: String,
        title: String,
        rank: Number,
        image: String,
        duration: Number,
        media: String,
        description: String,
        username: String,
    },
    {
        timestamps: false,
        versionKey: false
    });

// create the model for users and expose it to our app
module.exports = mongoose.model('track', TrackSchema);
