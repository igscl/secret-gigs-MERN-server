const {
    getAllEvents, 
    addEvent, 
    getEventById, 
    updateEvent, 
    deleteEvent} = require("../utils/event_utilities")

const getEvents = function(req,res){
    getAllEvents(req).exec((err,events) => {
        if(err){
            res.status(500)
            return res.json({
                error:err.message
            })
        }
        res.send(events)
    }
    )
}

const postEvent = function(req,res){
    addEvent(req.body).save((err,event)=>{
        if(err){
            res.status(500)
            res.json({
                error: err.message
            })
        }
        res.status(201)
        res.send(event)
    }
    )
}

const getEvent = function(req,res){
    getEventById(req).exec((err,event) => {
        if (err){
            res.status(404)
            return res.send("Event not found")
        }
        res.send(event)
    })
}

const modifyEvent = function(req, res){
    updateEvent(req).exec((err,event)=>{
        if (err){
            res.status(500)
            return res.json({
                error: err.message
            })
        }
        res.status(200)
        res.send(event)
    }
    )
}

const removeEvent = function(req,res){
    deleteEvent(req).exec((err,event)=>{
        if (err){
            res.status(500)
            return res.json({
                error: err.message
            })
        }
        res.sendStatus(204)
    })
}

module.exports = {getEvents, postEvent, getEvent, modifyEvent, removeEvent}