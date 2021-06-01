const express = require('express');
const playlistController = require('../controller/playlist')

module.exports = () => {
    let router = express.Router();
    router.get('/', playlistController.info);
    return router;
};