
const mongoose = require("mongoose");
const {Schema} = mongoose;

const reviewschema = new mongoose.Schema({
    comment:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        min: 1,
        max: 5,
    },
    created:{
        type: Date,
        default: Date.now,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
});

module.exports = mongoose.model("review",reviewschema);
