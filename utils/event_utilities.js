const Event = require("../models/event")

const getAllEvents = function(req){
    return Event.find()
}

const addEvent = function(req){
    return new Event(req.body)
}

const getEventById = function(req){
    return Event.findById(req.params.id)
}

const updateEvent = function(req){
    return Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
}

const deleteEvent = function(req){
    return Event.findByIdAndRemove(req.params.id)
}

module.exports = {
    getAllEvents, 
    addEvent, 
    getEventById, 
    updateEvent, 
    deleteEvent}