/**
 * Created by angus on 2016/11/20.
 */
"use strict";

const express = require('express');
const yts = require('./api/yts.api.js');
const torrent = require('./my_torrent_stream');
const movieAPI = require('./api/movie.api.js');
const userAPI = require('./api/user.api');
const tmdb = require('./api/tmdb.api.js');
const router = express.Router();
const request = require('request');

router.get('/users/:id?', (req, res) => {
    if (req.params.id === undefined) {
        return res.status(404).json('User not found.');
    }
    userAPI.getUser({_id: req.params.id})
        .then(user => res.json(user))
        .catch(error => res.status(500).json(error));
});

router.get('/captions/:id?', (req, res) => {
	if (req.params.id === undefined) {
		return res.status(404).json('missing id');
	}
	yts.getDetails(req.params.id)
		.then(captions => res.json(captions))
		.catch(error => res.status(500).json(error));
});

router.get('/movies/:page?', (req, res) => {
	movieAPI.getPage((req.params.page === undefined) ? 1 : parseInt(req.params.page))
		.then(bagOMovies => res.json(bagOMovies))
		.catch(error => res.status(500).json(error));
});

router.get('/watch/:hash?', (req, res) => {
	torrent.watch(req, res, req.params.hash);
});

router.get('/update', (req, res) => {
	movieAPI.update()
		.then(update => res.json(update))
		.catch(error => res.json(error));
});

router.get('/get_movie_details/:id', (req, res) => {
	tmdb.getMovieDetails(req.params.id)
		.then(details => res.json(details))
		.catch(error => res.status(500).json(error));
});

router.get('/find/:imdb', (req, res) => {
	tmdb.find(req.params.imdb)
		.then(found => res.json(found))
		.catch(error => res.status(500).json(error));
});

router.get('/get_movies', (req, res) => {
	movieAPI.getAllMovies()
		.then(bigBagOMovies => res.json(bigBagOMovies))
		.catch(error => res.status(500).json(error));
});

router.get('/get_movie/:imdb', (req, res) => {
	movieAPI.getMovie({imdb_id: req.params.imdb})
		.then(movie => res.json(movie))
		.catch(error => res.status(500).json(error));
});

router.get('/get_movie_by_slug/:slug', (req, res) => {
	movieAPI.getMovie({slug: req.params.slug})
		.then(movie => res.json(movie))
		.catch(error => res.status(500).json(error));
});

router.get('/get_all_cast/:firstLetter', (req, res) => {
	movieAPI.getAllCast(req.params.firstLetter)
		.then(cast => res.json(cast))
		.catch(error => res.status(500).json(error));
});

module.exports = router;