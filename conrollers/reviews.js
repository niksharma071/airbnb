const listing = require("../models/listing");
const review = require("../models/reviews");

module.exports.reviewdatareceived = async(req,res,next)=>{
    try{
        let {id} = req.params;
        let findlist = await listing.findById(id);
        let newreview = new review(req.body.review);
        newreview.author = req.user._id;
        findlist.review.push(newreview);

        await newreview.save();
        await findlist.save();
        req.flash("sucess","comment sucessfull");
        res.redirect(`/listing/${id}`);
    }catch{
        next(new expresserror(800,"error in review"));
    }
    
}

module.exports.deletereviw = async(req,res)=>{
    let {id, reviewid} = req.params;
    let resultupdate = await listing.findByIdAndUpdate(id,{$pull: {review: reviewid}});
    let result = await review.findByIdAndDelete(reviewid);
    req.flash("sucess","comment delete sucessfully");
    res.redirect(`/listing/${id}`);

};