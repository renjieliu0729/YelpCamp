const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
};


module.exports.createCampground = async (req, res, next) => {
        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send();
        //console.log(geoData.body.features[0].geometry.coordinates);
        // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        campground.geometry = geoData.body.features[0].geometry;
        await campground.save();
        // console.log(campground.geometry);
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${campground._id}`)
    };


module.exports.showCampground = async (req, res,) => {
        const campground = await Campground.findById(req.params.id).populate({
            path: 'reviews',
            populate:{
                path: 'author'
            }
        }).populate('author');
        // console.log(campground.geometry);
        // console.log(process.env.MAPBOX_TOKEN);
        res.render('campgrounds/show', { campground });
    };


module.exports.renderEditForm = async (req, res) => {
        const campground = await Campground
        if (!campground) {
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { campground });
    };



module.exports.updateCampground = async (req, res) => {
        const { id } = req.params;
        const campground  = await Campground.findById(id);
    
        const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        req.flash('success', 'Successfully updated campground!');
        res.redirect(`/campgrounds/${campground._id}`)
    };


module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
};
