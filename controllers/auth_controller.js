const passport = require("passport")
const User = require("../models/user")
const {handleError} = require("../utils/common_utils")

const register = function (req, res) {
    User.register(new User({
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    }), req.body.password, function (err) {
        if (err) {
            
        //     res.status(500)
        //     res.json({error: err})
        // } else {
        //     loginUser(req, res)

        if(err.name === 'UserExistsError') {
            req.status = 409;
            req.message = err.message;
            return handleError(req,res);
        } else {
            req.message = err.message;
            return handleError(req,res);
        }
        }
        loginUser(req, res)
    })
}

const authenticate = passport.authenticate("local")
// helper function

const loginUser = (req, res) => {
    	// passport.authenticate returns a function that we will call 
//with req, res, and a callback function to execute on success    

    authenticate(req, res, function () {
        console.log('authenticated user: ', req.user.username);
		console.log('session: ', req.session);
        res.status(200);
        res.json({user: req.user, sessionID: req.sessionID});
    })
}


const logout = function(req, res) {
	req.logout()
	console.log("logged out user")
	console.log("session object:", req.session)
	console.log("req.user:", req.user)
	res.sendStatus(200)
}


module.exports = { register, loginUser, logout }