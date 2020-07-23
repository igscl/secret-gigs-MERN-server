const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Token = new Schema ({
    valid:{
        type: Boolean,
        default: true
    },
    lives:{
        type: Number,
        required: true,
    },
    usedByPhone:{
        type: Array
    },
    forEvent:{
        type: String,
        required: true
    }

})

module.exports = mongoose.model("Token",Token)


