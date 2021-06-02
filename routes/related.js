const express = require('express');
const relatedController = require('../controller/related')

module.exports = () => {
    let router = express.Router();
    router.get('/', relatedController.info);
    return router;
};