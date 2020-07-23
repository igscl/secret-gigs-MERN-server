const Event = require("../models/event")
const { ObjectID } = require('mongodb')
const User = require("../models/user")


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
        "username":`${req.user.username}`
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
    console.log(event.applicants)
    event.applicants

    let acceptedUsers = []

    let limit = event.capacity,
        amount = 3,
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
    for (let i=0 ; i<event.applicants.length; i++){
        if (uniqueRandomIndex.includes(i)){
        event.applicants[i].accepted = true
    }
    }

    return Event.findByIdAndUpdate(req.params.id, event, {
        new: true
    })

}

const findAndAcceptTokenUser = async (req) =>{
    //if phone number has applied to event, accept it
    // if req.body.From is in Event
    try{
    let event = await Event.find(
        {"applicants.phoneNumber": req.body.From})
        
        console.log("FOUND MATCHES!",event)
        indexMatch = event[0].applicants.findIndex(x => x.phoneNumber === `${req.body.From}`)
        console.log(indexMatch)
        event[0].applicants[indexMatch].accepted = true
        event[0].save()

        return Event.findByIdAndUpdate(event[0].id, event[0], {
            new: true
        })
    
    }catch(err){

    }
}


module.exports = {
    getAllEvents,
    addEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    updateApplyToEvent,
    chooseRandomUsers,
    findAndAcceptTokenUser
}