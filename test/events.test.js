const mongoose = require('mongoose')
const expect = require("expect")
const Event = require("../models/event")
const {
    getAllEvents, 
    addEvent, 
    getEventById, 
    updateEvent, 
    deleteEvent} = require("../utils/event_utilities")

const dbConn = 'mongodb://localhost/secret_gigs_test'

function connectToDb(done) {mongoose.connect(
    dbConn,
    {
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useFindAndModify : false
    }, 
    err => {
        if (err){
            console.log("error connecting database", err)
            done()
        } else{
            console.log("Connected to SG Database!")
            done()
        }
    }
)}
let eventId = null


before(done => {
    connectToDb(done)
  })

  after(done => {
	mongoose.disconnect(() => done())
})

// Setup and tear down functions
function setupData() {
	let testEvent = {}
	testEvent.name = "tester"
	testEvent.date = "september"
	testEvent.generalLocation = "cool place"
	testEvent.specificLocation = "my home"
	testEvent.capacity = 10
    
    return Event.create(testEvent)
}

beforeEach( async () => {

    await Event.deleteMany()
    let event = await setupData()
    eventId = event._id

})


describe("getAllEvents", () => {
    let req = {
            query: {}
        }
	it("should get all events", async () => {
        await getAllEvents(req).exec((err,event) =>{
            expect(Object.keys(event).length).toBe(1)
        })
        // Pass an empty req object
		
	})
	it("name of first event should be tester", async () => {
        await getAllEvents(req).exec((err,event) => {
            expect(event[0].name).toBe("tester")
        })
	})
})

describe("getEventById", () => {
    it("first event name should be tester", async () => {
        let req = {
            params: {
                id: eventId
            }
        }
        await getEventById(req).exec((err, event) => {
            expect(event.name).toBe("tester")
        })
    })
})

describe("addEvent", () => {
    it("should add an event", async () => {
        const req = {
            body: {
                name: "another event",
                date: "september",
                generalLocation: "somewhere over the rainbow",
                specificLocation: "way up high",
                capacity: 10
            }
        }
        await addEvent(req).save((err, event) => {
            expect(event.name).toBe(req.body.name)
        })
    })
})

describe("deleteEvent", () => {
    it("should delete the specified event", async () => {
        let req = {
            params: {
                id: eventId
            }
        }
        await deleteEvent(req).exec();
        await Event.findById(req.params.id).exec((err, event) => {
            expect(event).toBe(null);
        })
    })
})

describe("updateEvent", () => {
    it("should update an event", async () => {
        const req = {
            params: {
                id: eventId
            },
            body: {
                name: "updated event",
                date: "november",
                generalLocation: "somewhere over the rainbow",
                specificLocation: "way up high",
                capacity: 10
            }
        };
        await updateEvent(req).exec((err, event) => {
            expect(event.name).toBe(req.body.name);
        });
    });
});