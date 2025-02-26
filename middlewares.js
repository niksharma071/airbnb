const listing = require("./models/listing");
const express = require("express");
const review = require("./models/reviews.js");


class expresserror extends Error{
    constructor(statuscode,msg){
        super();
        this.statuscode = statuscode;
        this.msg = msg;
    }
}

module.exports.islogedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl = req.originalUrl;
        req.flash("error","you must be log before adding a listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveredirecturl = (req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl = req.session.redirecturl;
    }
    next();
};

module.exports.isreviewauthor = async (req,res,next)=>{
    let {id,reviewid} = req.params;
    let findreview = await review.findById(reviewid);
    if(!findreview.author._id.equals(res.locals.curruser._id)){
        console.log("yes");
        req.flash("error","you are not the author of this comment");
        return res.redirect(`/listing/${id}`);
    }
    next();

};


// module.exports.isowner = async (req,res,next)=>{
//     let {id} = req.params;
//     let listingda = req.body.listing;
//     let finduser = await listing.findById(id)
//     if(!finduser.owner._id.equals(res.locals.curruser)){
//         req.flash("error","you dont have the permission to edit this property");
//         return res.redirect(`/listing/${id}`);
//     }
//     next();
// }
