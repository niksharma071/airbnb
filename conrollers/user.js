const user = require("../models/user")

module.exports.signupform = (req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signupdatareceived = async(req,res)=>{
    try{
    const {username,email,password} = req.body;
    const newuser = new user({email,username});
    console.log("hi1");
    let registered = await user.register(newuser,password);
    console.log("hi2");
    req.logIn(registered,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess","Welcome To AirBnb");
        res.redirect("/listing");
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderslogin = (req,res,next)=>{
    res.render("user/login.ejs");
};

module.exports.logindata = async (req,res,next)=>{
    req.flash("sucess","Welcome To AirBnb");
    if(!res.locals.redirecturl){
        res.locals.redirecturl = "/listing";
    }
    res.redirect(res.locals.redirecturl);
};


module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            console.log("error in logout");
            return next(err);
        }
        req.flash("sucess","You Have Logedout")
        res.redirect("/listing");
    })
};
