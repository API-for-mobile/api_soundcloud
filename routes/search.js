const express = require('express');
const searchController = require('../controller/search')

module.exports = () => {
    let router = express.Router();
    router.get('/tracks', searchController.tracks);
    router.get('/albums', searchController.albums);
    router.get('/playlists', searchController.playlists);
    return router;
};