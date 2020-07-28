const express = require("express")
const router = express.Router()
const {
    getEvents, 
    postEvent, 
    getEvent, 
    modifyEvent, 
    removeEvent,
    applyToEvent,
    myEvents,
    // userAuthenticated,
    selectRandomUsers

} = require("../controllers/event_controllers")
const { userAuthenticated, userIsAdministrator } = require("../utils/common_utils")


//After this require login
// router.use(userAuthenticated)
router.use(userAuthenticated/*, validUser*/)

// READ
router.get("/", getEvents)

//View Events
router.get("/myevents", myEvents)

//READ
router.get("/:id", getEvent)

// CREATE
router.post("/", postEvent)

// //UPDATE
router.put("/:id", modifyEvent)

//DELETE
router.delete("/:id", removeEvent)

//UPDATE
router.put("/:id/apply", applyToEvent)


router.use(userIsAdministrator)
//UPDATE
router.put("/:id/select", selectRandomUsers)



module.exports = router;