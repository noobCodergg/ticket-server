const express = require("express");
const { postTicket, getTickets, cancelTicket, updateStatus, getCancelledRequest, createTrip, getTrip, updateTrip, deleteTrip, getDailySales } = require("../controllers/ticketController");




const router = express.Router();

router.post('/post-ticket',postTicket)
router.get('/get-tickets/:userId',getTickets)
router.delete('/cancel-ticket/:ticketId',cancelTicket)
router.put('/update-isCancelled/:ticketId',updateStatus)
router.get('/get-cancelled-request',getCancelledRequest)
router.post('/post-trip',createTrip)
router.get('/get-trips/:userId',getTrip)
router.put('/update-trip/:id',updateTrip)
router.delete('/delete-trip/:id',deleteTrip)
router.get('/get-daily-sales',getDailySales)


module.exports = router;