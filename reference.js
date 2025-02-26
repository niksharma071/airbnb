const express = require("express");
const app = express();

const mongoose = require('mongoose');
const path = require("path");
const chat = require("./models/chat.js")
const methodover = require("method-override");

app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(methodover("_method"))

main()
.then(() =>{
    console.log("connection sucessfull");
})
.catch((err)=> console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.get("/chat",async(req,res)=>{
    let chats = await chat.find();
    res.render("showchats.ejs", {chats});
    res.se
});

app.get("/chat/new" ,(req,res)=>{
    res.render("new.ejs");
});

app.post("/chat/new",async(req,res)=>{
    let {from, to, msg} = req.body;
    let date = new Date();
    let userchat = new chat({
        from: from,
        to: to,
        msg: msg,
        created: date,
    });
     await userchat.save();
     res.redirect("/chat");
});

app.get("/edit/:id",async(req,res)=>{
    let {id} = req.params;
    let idchat =  await chat.findById(id);
    res.render("editchat.ejs",{idchat});
});
app.delete("/distroy/:id", async(req,res)=>{
    let {id} = req.params;
    let deletechat = await chat.findByIdAndDelete(id);
    res.redirect("/chat");
});
app.put("/edit/:id",async(req,res)=>{
    let {id} = req.params;
    let {msg} = req.body;
    let updatechat = await chat.findByIdAndUpdate(id, {msg: msg});
    res.redirect("/chat");
});


app.listen(8080,()=>{
    console.log("app is listining");
});