const passport = require("passport")
const User = require("../models/user")

// Create the local strategy
passport.use(User.createStrategy())

// Use passport-local-mongoose serialize and deserialize functions
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())