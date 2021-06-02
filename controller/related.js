const axios = require('axios');

function info (req, res, next) {
    const id = req.query.id
    if (!id) {
        next()
        return
    }
    let config = {
        method: 'get',
        url: `https://api-mobile.soundcloud.com/tracks/${id}/related?client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
    };

    axios(config)
        .then((response) => {
            try {
                const collection = response.data.collection
                let tracks = []
                collection.forEach(track => {
                    let stream_url = track.stream_url
                    if (!stream_url) {
                        let transcodings = track.media.transcodings
                        stream_url = transcodings[transcodings.length - 1].url
                    }
                    stream_url = stream_url.replace("https://api-mobile.soundcloud.com","")
                    tracks.push({
                        id: track.urn,
                        title: track.title,
                        image: track.artwork_url_template ? track.artwork_url_template.replace("{size}", "t300x300") : "",
                        duration: track.full_duration,
                        description: track.description,
                        username: track["_embedded"].user.username,
                        media: stream_url
                    })
                });
                res.json({
                    tracks: tracks
                })
            } catch (error) {
                res.json({
                    error: error.message
                })
            }
        })
        .catch((error) => {
            console.log(error);
            next()
        });
}

exports.info = info;