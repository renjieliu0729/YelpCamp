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


// add reviews to the camp
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully reviewed campground')
    res.redirect(`/campgrounds/${campground._id}`)
    }));
    
    //delete a review for a camp
    router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully deleted a review')
        res.redirect(`/campgrounds/${id}`);
        console.log(id);
    }))

    module.exports = router;
