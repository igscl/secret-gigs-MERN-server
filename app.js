const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require("passport")
const session = require('express-session')
const MongoStore = require("connect-mongo")(session)
const eventRouter = require("./routes/event_routes")
const authRouter = require("./routes/auth_routes")
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const tokenRouter = require("./routes/token_routes")

// Sets port if deploying to external provider 
// or port assigned already
const port = process.env.PORT || 3003;
//

// Equivalent of create server in http library
const app = express();

// Call the middleware we want to use
const allowList = [
    'http://localhost:3000',
    'https://secret-gigs.netlify.app'

]
app.use(cors({
    credentials: true,
    origin: function (origin,callback) {
        // Check each url in allowList and see if it includes the origin (instead of matching exact string)
        const allowListIndex = allowList.findIndex((url) => url.includes(origin))
        console.log("found allowListIndex", allowListIndex)
        callback(null,allowListIndex > -1)
    }
}));

// const corsOptions = {
//     credentials: true
// }
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

// Connect to database

// const dbConn = process.env.MONGODB_URI || 'mongodb://localhost/secret_gigs';
const dbConn = 'mongodb://localhost/secret_gigs';

mongoose.connect(
    dbConn,
    {
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useFindAndModify : false,
        useCreateIndex : true
    }, 
    err => {
        if (err){
            console.log("error connecting database", err)
        } else{
            console.log("Connected to SG Database!")
        }
    }
)

// Define a simple route for GET
// app.get("/",(req,res) => {
//     res.send("Express server running")
// });

app.use(
    session({
        secret: "super secret secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1800000
        },
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    })
)


require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

//routes
app.use("/events", eventRouter)
app.use("/auth", authRouter)
app.use('/sms',tokenRouter)

// Listen
app.listen(port, () => console.log(`Listening on port ${port}`));