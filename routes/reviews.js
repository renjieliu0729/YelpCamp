const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {campgroundSchema} = require('../schemas')
const {reviewSchema} = require('../schemas');
const Joi = require('joi');


const validateReview = (req,res,next) => {

    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


// add reviews to the camp
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully reviewed campground')
    res.redirect(`/campgrounds/${campground._id}`)
    }));
    
    //delete a review for a camp
    router.delete('/:reviewId', catchAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully deleted a review')
        res.redirect(`/campgrounds/${id}`);
        console.log(id);
    }))

    module.exports = router;
