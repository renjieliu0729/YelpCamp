const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {reviewSchema} = require('../schemas');
const Joi = require('joi');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

// main page of campgrounds
router.get('/', catchAsync(campgrounds.index));

// page for making new camp
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// make a new camp ground
router.post('/', validateCampground, catchAsync(campgrounds.createCampground));


// go to the camp page by id
router.get('/:id', catchAsync(campgrounds.showCampground));


//edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

 
// update the camp
router.put('/:id', isLoggedIn, isAuthor, validateCampground, campgrounds.updateCampground);


// delete a camp
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;


