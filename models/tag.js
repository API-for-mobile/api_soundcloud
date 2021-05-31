// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var TagSchema = mongoose.Schema(
    {
        name: String,
        image: String,
        color: String
    },
    {
        timestamps: false,
        versionKey: false
    });

    TagSchema.set('toJSON', {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    });

// create the model for users and expose it to our app
module.exports = mongoose.model('tag', TagSchema);
