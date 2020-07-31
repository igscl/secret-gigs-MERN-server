const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")
const uniqueValidator = require('mongoose-unique-validator')


const User = new Schema({
    email: {
        type: String,
        required: true,
        // commented out for testing purposes
        // unique: true,
        // uniqueCaseInsensitive: true

    },
    isAdmin: {
        type: Boolean,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    availableToken: {
        type: String,
        required:false
    },
    eventsApplied: {
        type: Array,
        required: false
    }
})

// plugin the passport-local-mongoose middleware with our User schema
User.plugin(passportLocalMongoose)
User.plugin(uniqueValidator);

module.exports = mongoose.model("User", User)