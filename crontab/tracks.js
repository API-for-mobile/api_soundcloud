const axios = require('axios');

require('dotenv').config()
var mongoose = require('mongoose');

// connect to our database
const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || 27017
const dbName = process.env.DB_NAME || 'soundcloud'
const mongoUrl = `mongodb://${dbHost}:${dbPort}/${dbName}`

const connectWithRetry = function () { // when using with docker, at the time we up containers. Mongodb take few seconds to starting, during that time NodeJS server will try to connect MongoDB until success.
    return mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err)
            setTimeout(connectWithRetry, 5000)
        }
    })
}
connectWithRetry()


function apikey() {
    let array = ["2c38f8467b8a9e1546095e29e99e934d", "c04b75e325aed0d3efd03dd90658a11d", "027165dc644bfe1f19ee22d042c4b76d", "76bb8ff723795d082302290b16b44c89", "874f12161379f13d1196d099617272db", "08e5c9eecb5f8b6c73eb8d9908843d09", "5afe73c37d31af66ecc7d578f0114625", "253344ec8e3ab0125cf75890154b2aa2"]
    const random = Math.floor(Math.random() * array.length);
    return array[random];
}

let api_key = apikey()

function albumgetinfo(artist, album, idObject) {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${api_key}&artist=${artist}&album=${album}&format=json`
        };

        axios(config)
            .then( async (response) => {
                let tracksSoucloud = response.data.album.tracks
                let tracks = []
                for (let index = 0; index < tracksSoucloud.length; index++) {
                    const element = tracksSoucloud[index];
                    const track = await searchSoundcloud(element.name)
                    tracks.push(track)
                }
                resolve(tracks)
            })
            .catch((error) => {
                console.log(error);
                reject(error)
            });
    })
}

function searchSoundcloud(keySearch, rank) {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `https://api-mobile.soundcloud.com/search/tracks?q=${keySearch}&limit=1&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
        };

        axios(config)
            .then((response) => {
                try {
                    const track = response.data.collection[0]
                    let transcodings = track.media.transcodings
                    resolve({
                        id: track.urn,
                        title: track.title,
                        rank: rank,
                        image: track.artwork_url_template.replace("{size}", "t300x300"),
                        duration: track.full_duration,
                        description: track.description,
                        username: track["_embedded"].user.username,
                        media: transcodings[transcodings.length - 1]
                    })
                } catch (error) {
                    reject(error)
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error)
            });
    })
}

const Album = require('../models/album')

async function listAlbum(artist) {
    let nameArtist = artist.name
    let albums = artist.albums
    for (let index = 0; index < albums.length; index++) {
        const element = albums[index];
        let tracks = await albumgetinfo(nameArtist, element.name, element._id)
        let album = element
        album["tracks"] = tracks
        //Save
        Album.updateOne({ name: element.name }, { $set: album }, { new: true, upsert: true },
            function (err, done) {
                console.log(artist, err, done)
            })
    }
}

const Artist = require('../models/artist')
Artist.find()
    .sort({rank: 1})
    .exec(function (err, artists) {
        artists.forEach(element => {
            listAlbum(element)
        });
    })