const listing = require("../models/listing");
const reviews = require("../models/reviews");
module.exports.index = async (req,res,next)=>{
    try{
        const alllist = await listing.find({});
        res.render("listing/show.ejs",{alllist});
    } catch{
        next(new expresserror(404,"Error In Finding"));
      
    }  
};

module.exports.rendersnewform = (req,res)=>{
    res.render("listing/new.ejs");
};

module.exports.datanewlisting = async(req,res,next)=>{
    try{
        //let result = listingschvalid.validate(req.body);
        let url = req.file.path;
        let filename = req.file.filename;
        let listingda = req.body.listing;
        const newlisting = await new listing(listingda);
        newlisting.owner = req.user._id;
        newlisting.image = {url,filename};
        await newlisting.save();
        req.flash("sucess","New Listing Created");
        res.redirect("/listing");
    }catch{
        next(new expresserror(800,"new"));
    }
     
};

module.exports.showlisting = async(req,res)=>{
    let {id} = req.params;
    const findlist = await listing.findById(id).populate({path: "review",populate: {path: "author"},}).populate("owner");
    if(!findlist){
        req.flash("error","Listing You Requesting Not Found");
        res.redirect("/listing");
    }
    res.render("listing/showlist.ejs",{findlist});
};

module.exports.rendereditform = async(req,res)=>{
    let {id} = await req.params;
    let findlistt = await listing.findById(id);
    res.render("listing/edit.ejs",{findlistt});
};

module.exports.editeddaatareceived = async(req,res)=>{
    let {id} = req.params;
    let listingda = req.body.listing;
    let finduser = await listing.findById(id)
    if(!finduser.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","You Dont Have The Permission To Edit This Property");
        return res.redirect(`/listing/${id}`);
    }
    await listing.findByIdAndUpdate(id,{...listingda});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        finduser.image = {url,filename};
        await finduser.save();
    }
    req.flash("sucess","Listing Edited Sucessfully");
    res.redirect("/listing");

};

module.exports.deletelisting = async(req,res)=>{
    let {id} = req.params;
    let listingdata = await listing.findById(id);
    for(revi of listingdata.review){
        await reviews.findByIdAndDelete(revi);
    }
    await listing.findByIdAndDelete(id);
    req.flash("sucess","Listing Deleted Sucessfully");
    res.redirect("/listing");
};
