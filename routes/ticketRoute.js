const express = require("express");
const { postTicket } = require("../controllers/ticketController");




const router = express.Router();

router.post('/post-ticket',postTicket)



module.exports = router;