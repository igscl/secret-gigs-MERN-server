const {
    getAllEvents, 
    addEvent, 
    getEventById, 
    updateEvent, 
    deleteEvent,
    updateApplyToEvent,
    chooseRandomUsers
    
    } = require("../utils/event_utilities")

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
    addEvent(req).save((err,event)=>{
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

const applyToEvent = (req, res) => {
    if (req.error) {
        res.status(req.error.status)
        res.send(req.error.message)
    } else {
        // req.body.username = req.user.username
        updateApplyToEvent(req).then((event) => {
            res.status(200).send(event)
        }).catch((err) => {
            res.status(500).json({ error: err.message })

		})
    }
}

const userAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.sendStatus(403)
    }
}

const selectRandomUsers = (req, res) => {
    if (req.error) {
        res.status(req.error.status)
        res.send(req.error.message)
    } else {
        // req.body.username = req.user.username
        
        chooseRandomUsers(req).then((event) => {
            res.status(200).send(event)
        }).catch((err) => {
            res.status(500).json({ error: err.message })

		})
    }
} 

module.exports = {
    getEvents, 
    postEvent, 
    getEvent, 
    modifyEvent, 
    removeEvent, 
    applyToEvent,
    userAuthenticated,
    selectRandomUsers
}