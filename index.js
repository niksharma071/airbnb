
require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const { compile } = require("ejs");
const methodover = require("method-override");
const ejsmate = require("ejs-mate");
const { findById } = require("./models/reviews.js");
const review = require("./models/reviews.js");
const {listingschvalid, reviewschvalid } = require("./schemavalid.js");
const listingroute = require("./routes/listingrouter.js");
const reviewrouter = require("./routes/reviewrouter.js");
const userrouter = require("./routes/userrouter.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { date } = require("joi");
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const user = require("./models/user.js");
app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodover("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));



const dburl = process.env.ATLASDB_URL;


main()
.then(() =>{
    console.log("connection sucessfull");
})
.catch((err)=> console.log(err));
async function main() {
  await mongoose.connect(dburl);
}




//exppress error handling for customize error
class expresserror extends Error{
    constructor(statuscode,msg){
        super();
        this.statuscode = statuscode;
        this.msg = msg;
    }
}

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",() =>{
    console.log("error in mongo session store",err);
})

const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};




app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.sucess = req.flash("sucess");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next(); 
})

//listing router
app.use("/",listingroute);


//reviewrouter
app.use("/",reviewrouter);

app.use("/",userrouter);

//if wrong page request send by user
app.all("*",(req,res,next)=>{
    next(new expresserror(404,"page not found1"));
});


//to display the error
app.use((err,req,res,next)=>{
    let{statuscode = 500, msg = "something went wrong"} = err;
    res.status(statuscode).send(msg);
})


app.listen(8080,(req,res)=>{
    console.log("listining");
});
