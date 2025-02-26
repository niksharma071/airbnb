const { string } = require("joi");
const mongoose = require("mongoose");
const {Schema} = mongoose;

const listingsch =  new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    price:{
        type: Number,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
});

const listing = mongoose.model("listing",listingsch);

module.exports = listing;