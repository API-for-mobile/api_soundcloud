const express = require('express');
const router = express.Router();

const Artist = require('../models/artist')
router.get('/home', async function (req, res) {
    Artist.find()
    .sort({rank: 1})
    .exec(function (err, artists) {
        res.json({ artists: artists})
    })
})

module.exports = router;