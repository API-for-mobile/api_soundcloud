const axios = require('axios');

function tracks (req, res, next) {
    const keySearch = req.query.q
    if (!keySearch) {
        next()
        return
    }
    const page = req.query.page
    let url;
    if (!page || page == 0) {
        url = `https://api-mobile.soundcloud.com/search/tracks?q=${encodeURI(keySearch)}&limit=24&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
    } else {
        url = `https://api-mobile.soundcloud.com/search/tracks?q=${encodeURI(keySearch)}&limit=24&next=${page*24}&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
    }
    let config = {
        method: 'get',
        url: url
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
                    error: error
                })
            }
        })
        .catch((error) => {
            console.log(error);
            next()
        });
}

function albums (req, res, nexr) {
    const keySearch = req.query.q
    if (!keySearch) {
        next()
        return
    }
    const page = req.query.page
    let url;
    if (!page || page == 0) {
        url = `https://api-mobile.soundcloud.com/search/albums?q=${encodeURI(keySearch)}&limit=24&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
    } else {
        url = `https://api-mobile.soundcloud.com/search/albums?q=${encodeURI(keySearch)}&limit=24&next=${page*24}&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
    }
    let config = {
        method: 'get',
        url: url
    };

    axios(config)
        .then((response) => {
            try {
                const collection = response.data.collection
                let albums = []
                collection.forEach(track => {
                    albums.push({
                        id: track.urn,
                        title: track.title,
                        image: track.artwork_url_template ? track.artwork_url_template.replace("{size}", "t300x300") : "",
                        count: track.track_count,
                        description: track.description,
                    })
                });
                res.json({
                    albums: albums
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

function playlists (req, res, nexr) {
    const keySearch = req.query.q
    if (!keySearch) {
        next()
        return
    }
    const page = req.query.page
    let url;
    if (!page || page == 0) {
        url = `https://api-mobile.soundcloud.com/search/playlists_without_albums?q=${encodeURI(keySearch)}&limit=24&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
    } else {
        url = `https://api-mobile.soundcloud.com/search/playlists_without_albums?q=${encodeURI(keySearch)}&limit=24&next=${page*24}&client_id=Fiy8xlRI0xJNNGDLbPmGUjTpPRESPx8C`
    }
    let config = {
        method: 'get',
        url: url
    };

    axios(config)
        .then((response) => {
            try {
                const collection = response.data.collection
                let playlists = []
                collection.forEach(track => {
                    playlists.push({
                        id: track.urn,
                        title: track.title,
                        image: track.artwork_url_template ? track.artwork_url_template.replace("{size}", "t300x300") : "",
                        count: track.track_count,
                        description: track.description,
                    })
                });
                res.json({
                    playlists: playlists
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

exports.tracks = tracks;
exports.albums = albums;
exports.playlists = playlists;