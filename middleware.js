const {campgroundSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const {reviewSchema} = require('./schemas');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

// save the session 
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// validate if its a campground 
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// validate if user is the autor for the camp
module.exports.isAuthor = async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        res.redirect(`/campgrounds/${req.params.id}`);
    };
    next();
}


// validate if user is the autor for the review
module.exports.isReviewAuthor = async(req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that')
        res.redirect(`/campgrounds/${req.params.id}`);
    };
    next();
}


// validate if the review is validate
module.exports.validateReview = (req,res,next) => {

    const {error} = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}