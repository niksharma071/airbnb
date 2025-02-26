const express = require("express");
const router = express.Router({ mergeParams: true });
const user = require("../models/user");
const passport = require("passport");
const {saveredirecturl} = require("../middlewares.js");
const usercontroller = require("../conrollers/user.js");

//renders form for signup page
router.get("/signup",usercontroller.signupform)

//sends data to db
router.post("/signup",usercontroller.signupdatareceived);


//renders login page for route
router.get("/login",usercontroller.renderslogin)

//receives data and authenitacte user
router.post("/login",
    saveredirecturl,
    passport.authenticate("local",{failureRedirect: "/login", failureFlash:true}),
    usercontroller.logindata
    )

//receives logout request
router.get("/logout", usercontroller.logout)



module.exports = router;