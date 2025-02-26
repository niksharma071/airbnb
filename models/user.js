const { string, required } = require("joi");
const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportlocalmongoose = require("passport-local-mongoose");

const usersch = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
});

usersch.plugin(passportlocalmongoose);

module.exports = mongoose.model("user",usersch);