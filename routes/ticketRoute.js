const express = require("express");
const { postTicket, getTickets, cancelTicket, updateStatus, getCancelledRequest } = require("../controllers/ticketController");




const router = express.Router();

router.post('/post-ticket',postTicket)
router.get('/get-tickets/:userId',getTickets)
router.delete('/cancel-ticket/:ticketId',cancelTicket)
router.put('/update-isCancelled/:ticketId',updateStatus)
router.get('/get-cancelled-request',getCancelledRequest)



module.exports = router;