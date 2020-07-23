const Token = require("../models/token")
const User = require("../models/user")

const getTokenKey = function(req){
    // req.body.lives = req.body.lives
    return Token.findById(req.body.Body)
    // return Token.findById(req.body.Body)
}

let lastTokenLife = 0

const redeemToken = function(token, req){
    console.log("THIS IS UTILS",token)
    //this is for the token's last usage
    if (token.lives === 0 && token.valid === true){
        token.valid = false

        return Token.findByIdAndUpdate(token.id, token,{
            new: true,
            })
    }
    // this is to deduct a life out of the token each time it's used
    if (token.lives > 0){
        token.lives = token.lives -= 1
        
        //pushes the token user's phone number to the token DB
        token.usedByPhone.push(req.body.From)

        return Token.findByIdAndUpdate(token.id, token,{
            new: true,
            })
        }
    // this is to not update if the token has expired
    if (token.lives === 0 && token.valid === false){
        return Token.findById(token)
    }
}

module.exports = {getTokenKey, redeemToken}