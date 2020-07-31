const Event = require("../models/event")
const { ObjectID } = require('mongodb')
const User = require("../models/user");
const { TokenInstance } = require("twilio/lib/rest/api/v2010/account/token");
const Token = require("../models/token");
const { Mongoose } = require("mongoose");
const mongoose = require("mongoose")
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const { registerHelper } = require("../controllers/auth_controller")


const getAllEvents = function (req) {
    return Event.find()
}

const addEvent = function (req) {
    return new Event(req.body)
}

const getEventById = function (req) {
    return Event.findById(req.params.id)
}

const updateEvent = function (req) {
    return Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
}

const deleteEvent = function (req) {
    return Event.findByIdAndRemove(req.params.id)
}

const updateApplyToEvent = async (req) => {
    let event = await Event.findById(req.params.id)
    console.log("EVENT!", event)
    let user = await User.find({
        "username": `${req.user.username}`
    })


    let foundMatches = await Event.find({
        "_id": ObjectID(`${event.id}`),
        "applicants": { "username": `${req.user.username}`, "phoneNumber": `${req.user.phoneNumber}`, "accepted": false }
    })
    console.log(`FOUND! ${req.user.username}`, foundMatches[0])

    if (foundMatches[0] === undefined /*&& user[0] !== undefined*/) {
        let newApplication = {
            username: req.user.username,
            phoneNumber: req.user.phoneNumber,
            accepted: false
        }
        let newEventAppliedTo = {
            eventId: event.id
        }
        //if user has an available token from automatic sign up through SMS, gets automatically accepted the applied event
        if (user[0].availableToken !== ""){
            newApplication.accepted = true
            user[0].availableToken = ""
            // user[0].save()
        }
        event.applicants.push(newApplication)

        // refactor
        // if (user[0] !== undefined){
        //saves the event to the user
        user[0].eventsApplied.push(newEventAppliedTo)
        user[0].save()
        // }

        return Event.findByIdAndUpdate(req.params.id, event, {
            new: true
        })


    } else {
        return Event.findById(req.params.id)
    }

}

const chooseRandomUsers = async (req) => {

    let event = await Event.findById(req.params.id)
    // /:id/choose
    console.log("THIS IS THE EVENT!!!!", event)
    console.log(event)
    event.applicants

    let acceptedUsers = []

    let limit = event.capacity,
        amount = 1,
        lowerBound = 0,
        upperBound = event.applicants.length,
        uniqueRandomIndex = []
    let allUsers = []

    if (amount < limit) limit = amount

    while (uniqueRandomIndex.length < limit) {
        let index = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound)
        if (uniqueRandomIndex.indexOf(index) == -1) {
            let randomUser = event.applicants[index]
            acceptedUsers.push(randomUser)
            uniqueRandomIndex.push(index)


        }
    }
    for (let i = 0; i < event.applicants.length; i++) {
        if (uniqueRandomIndex.includes(i) && event.applicants[i].accepted === false) {
            console.log(event.applicants[i].accepted)
            event.applicants[i].accepted = true
            let token = await Token.findOne({ lives: 5 })

            console.log("SENDING MESSAGE to:", event.applicants[i].phoneNumber)
            client.messages
            .create({
                body: `Good news! You've been accepted! Text the token to up to 5 friends for them to get accepted too! \n \n ${token.id}`,
                from: '+61488839216',
                to: `${event.applicants[i].phoneNumber}`
            })
            .then(message => console.log(message.sid))
            .catch(e => { console.error('Got an error:', e.code, e.message); });
        }
    }

    return Event.findByIdAndUpdate(req.params.id, event, {
        new: true
    })

}

const findAndAcceptTokenUser = async (req) => {
    //if phone number has applied to event, accept it
    // if req.body.From is in Event
    try {
        let event = await Event.find(
            { "applicants.phoneNumber": req.body.From })

        console.log("FOUND MATCHES!", event[0])
        indexMatch = event[0].applicants.findIndex(x => x.phoneNumber === `${req.body.From}`)
        console.log(indexMatch)
        event[0].applicants[indexMatch].accepted = true
        event[0].save()
        console.log("SECOND TIME", event[0])


        return Event.findByIdAndUpdate(event[0].id, event[0], {
            new: true
        })

    } catch (err) {
        try {
            // if cannot find user on DB then create a user with the phone number
            let user = await User.find({
                "phoneNumber": `${req.body.From}`
            })
            console.log(user[0])
            if (user[0] === undefined) {
                registerHelper(req)
                console.log("sending the MESSAGE")

                client.messages
                    .create({
                        body: `We couldn't find your number, so we created a user. Log into the website with username: ${req.body.From.substr(1)} and password: temporary`,
                        from: '+61488839216',
                        to: `${req.body.From}`
                    })
                    .then(message => console.log(message.sid))
                    .catch(e => { console.error('Got an error:', e.code, e.message); });

            }
        } catch (err) {

        }

    }
}

const findMyEvents = async (eventArray) => {
    console.log("findMyEvents!:", eventArray)
    const queryArray = eventArray.map((eventObject) => mongoose.Types.ObjectId(eventObject.eventId))

    return Event.find({
        '_id': { $in: queryArray }
    })

    // console.log(queryArray)
    // return queryArray
}

module.exports = {
    getAllEvents,
    addEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    updateApplyToEvent,
    chooseRandomUsers,
    findAndAcceptTokenUser,
    findMyEvents
}