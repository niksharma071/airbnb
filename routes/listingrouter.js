const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const {listingschvalid, reviewschvalid } = require("../schemavalid.js");
const reviews = require("../models/reviews.js");
const {islogedin} = require("../middlewares.js");
const listingcontroller = require("../conrollers/lsitings.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});

//wrapasync function for error handling
function wrapasync(fn){
    return function(req, res, next){
        fn(req,res,next).catch(next);
    }
}


//exppress error handling for customize error
class expresserror extends Error{
    constructor(statuscode,msg){
        super();
        this.statuscode = statuscode;
        this.msg = msg;
    }
}


//for validating the schema
const listinvalidate =  (req,res,next)=>{
    let {error} = listingschvalid.validate(req.body);

    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new expresserror(400, errmsg);
    }else{
        next();
    }
}

// shows all listings of user
router.get("/listing",listingcontroller.index);

//sends form for data for new listing
router.get("/listing/new",islogedin, wrapasync(listingcontroller.rendersnewform));


//recevies data from client and added to db

router.post("/listing/new", upload.single('listing[image]'),listinvalidate, wrapasync(listingcontroller.datanewlisting)
);


//show a particular listing which was clicked by user
router.get("/listing/:id", listingcontroller.showlisting);

//sends form page for edit an listing
router.get("/listing/:id/edit",islogedin,wrapasync(listingcontroller.rendereditform));


//receves updated data  edit the  listing
router.put("/listing/:id/edit",islogedin, upload.single('listing[image]'),listinvalidate, wrapasync(listingcontroller.editeddaatareceived));

//delte the particular listing 
router.delete("/listing/:id/distroy",islogedin, wrapasync(listingcontroller.deletelisting));

module.exports = router;