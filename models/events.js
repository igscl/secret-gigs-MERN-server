const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Events = new Schema ({
    name:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    generalLocation: {
        type: String,
        required: true
    },
    specificLocation: {
        type: String,
        required: true
    },
    capacity:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Events",Events)


