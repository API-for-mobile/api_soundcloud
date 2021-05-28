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

function gettopartists() {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${api_key}&format=json&limit=20`
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

const Artist = require('../models/artist')
function gettopalbums(artist, rank) {
    let config = {
        method: 'get',
        url: `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=${api_key}&format=json&limit=20`
    };

    axios(config)
        .then((response) => {
            let topalbums = response.data.topalbums.album
            let albums = []
            for (let index = 0; index < topalbums.length; index++) {
                const element = topalbums[index];
                let images = element.image
                let image = images[images.length - 1]
                albums.push({
                    name: element.name,
                    playcount: element.playcount,
                    image:  image["#text"]
                })
            }

            let artistObj = {
                name: artist,
                rank: rank,
                albums: albums
            }
            Artist.updateOne({ name: artist }, { $set: artistObj }, { new: true, upsert: true },
                function (err, done) {
                    console.log(artist, err, done)
                })
        })
        .catch((error) => {
            console.log(error);
        });

}

async function init() {
    let array = await gettopartists()
        .catch(function (err) {

        })
    if (!array) {
        return
    }
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        gettopalbums(element.name, index)
    }
}

init()