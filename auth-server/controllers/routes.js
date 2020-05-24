var express = require('express');
const Playlist = require('../models/playlist');
var mongoose = require('mongoose');
var router = express.Router();


router.get('/api/details', (req, res) => {
    console.log(req.body.user_id);

    
    Playlist.find({user_id : req.body.user_id}, (err, playlists) => {
        // if(err) return res.status(400).end();
        if(err) console.log(err);

        console.log('Concluded search')
        console.log(res.body);
        res.json(playlists);
        console.log(playlists);
    })
    res.send('API is working');


})

router.post('/api/details', (req, res) => {
    console.log('Received request');
    const newPlaylist = new Playlist({
        user_id : req.body.user_id,
        acousticness : req.body.acousticness,
        danceability : req.body.danceability,
        energy : req.body.energy,
        instrumentalness : req.body.instrumentalness,
        liveness : req.body.liveness,
        loudness : req.body.loudness,
        popularity : req.body.popularity,
        speechiness : req.body.speechiness,
        tempo : req.body.tempo,
        valence : req.body.valence
    });
    newPlaylist.save((err, event) => {
        if (err) return res.json(err);
        res.send(event);
    })
})

module.exports = router;