const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const review = require("../models/reviews.js");
const {reviewschvalid, listingschvalid} = require("../schemavalid.js");
const reveiwcontroller = require("../conrollers/reviews.js");
const { islogedin } = require("../middlewares.js");
const{isreviewauthor} = require("../middlewares.js");
//wrapasync function for error handling
function wrapasync(fn){
    return function(req, res, next){
        fn(req,res,next).catch(next);
    }
}

class expresserror extends Error{
    constructor(statuscode,msg){
        super();
        this.statuscode = statuscode;
        this.msg = msg;
    }
}

const reviewsvalid = (req,res,next)=>{
    let {error} = reviewschvalid.validate(req.body);

    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new expresserror(400, errmsg);
    }else{
        next();
    }
}


//review route
//receves review data and inserted in db
router.post("/listing/:id/review",islogedin, reviewsvalid, reveiwcontroller.reviewdatareceived);


//receves delete request from user
router.delete("/listing/:id/reviews/:reviewid",islogedin,isreviewauthor,reveiwcontroller.deletereviw);

module.exports = router;