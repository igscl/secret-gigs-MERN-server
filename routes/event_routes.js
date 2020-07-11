const express = require("express")
const router = express.Router()
const {
    getEvents, 
    postEvent, 
    getEvent, 
    modifyEvent, 
    removeEvent} = require("../controllers/event_controllers")

// READ
router.get("/", getEvents)

// CREATE
router.post("/", postEvent)

//READ
router.get("/:id", getEvent)

//UPDATE
router.put("/:id", modifyEvent)

//DELETE
router.delete("/:id", removeEvent)

module.exports = router;