const axios = require('axios');
const { parse } = require('node-html-parser');
const fs = require('fs');

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


function rgba2hex(orig) {
    rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        hex = rgb ?
            (rgb[1] | 1 << 8).toString(16).slice(1) +
            (rgb[2] | 1 << 8).toString(16).slice(1) +
            (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
    return hex;
}

const Tag = require('../models/tag')
async function getHome() {
    return new Promise((resolve, reject) => {
        let config = {
            method: 'get',
            url: `https://www.last.fm/music`
        };

        axios(config)
            .then(async (response) => {
                const root = parse(response.data)
                const imagesHTML = root.querySelectorAll('.music-more-tags-tag-background')
                const tagsHTML = root.querySelectorAll('.music-more-tags-tag-link')
                const overlaysHTML = root.querySelectorAll('.music-more-tags-tag-background-overlay')
                // let tags = []
                for (let index = 0; index < tagsHTML.length; index++) {
                    const tag = tagsHTML[index];
                    const img = imagesHTML[index].getAttribute("style");
                    const overlay = overlaysHTML[index].getAttribute("style")
                    const arrayColor = overlay.split("(")[1].split(')')[0].split(",")
                    let strColor = "rgb("
                    for (let index = 0; index < arrayColor.length - 1; index++) {
                        const element = arrayColor[index];
                        if (index == 0) {
                            strColor += `${element}`
                        } else {
                            strColor += `, ${element}`
                        }
                    }
                    strColor += ")"
                    //Save
                    Tag.updateOne({ name: tag.textContent }, {
                        $set: {
                            name: tag.textContent,
                            image: img.split("'")[1].split("'")[0],
                            color: rgba2hex(strColor)
                        }
                    }, { new: true, upsert: true },
                        function (err, done) {
                            console.log("Tag", err, done)
                        })
                    // tags.push({
                    //     name: tag.textContent,
                    //     image: img.split("'")[1].split("'")[0],
                    //     color: rgba2hex(strColor)
                    // })
                }
                resolve("")
            })
            .catch((error) => {
                console.log(error);
                reject(error)
            });
    })

}

async function init() {
    let array = await getHome()
        .catch(function (err) {

        })
    if (!array) {
        return
    }
    let data = JSON.stringify(array);
    fs.writeFileSync('tags.json', data);
}

init()