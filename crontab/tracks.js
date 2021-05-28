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
            .then((response) => {
                resolve(response.data.artists.artist)
            })
            .catch((error) => {
                console.log(error);
                reject(error)
            });
    })
}

function searchSoundcloud(keySearch) {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${api_key}&artist=${artist}&album=${album}&format=json`
        };

        axios(config)
            .then((response) => {
                resolve(response.data.artists.artist)
            })
            .catch((error) => {
                console.log(error);
                reject(error)
            });
    })
}

async function listAlbum(artist) {
    let nameArtist = artist.name
    let albums = artist.albums
    for (let index = 0; index < albums.length; index++) {
        const element = albums[index];
        await albumgetinfo(nameArtist, element.name, element._id)
    }
}

Artist.find()
    .sort({rank: 1})
    .exec(function (err, artists) {
        artists.forEach(element => {
            listAlbum(element)
        });
    })