const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {campgroundSchema} = require('../schemas')
const {reviewSchema} = require('../schemas');
const Joi = require('joi');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')

// add reviews to the camp
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
    
    //delete a review for a camp
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;
