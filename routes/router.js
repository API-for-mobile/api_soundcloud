const express = require('express');
const router = express.Router();

const search = require('./search')
router.use('/search', search())

var path = require('path');
const Tag = require('../models/tag')
router.get('/tags', async function (req, res) {
    Tag.find()
    .sort({rank: 1})
    .exec(function (err, tags) {
        res.json({ tags: tags})
    })
})

router.get('/tag/:name', async function (req, res) {
    res.sendFile(path.resolve(`./tags/${req.params.name}`));
})

module.exports = router;