const express = require("express");
const { createBusSchedule, getBusById, getAllSchedules } = require("../controllers/busController");



const router = express.Router();

router.post('/upload-bus',createBusSchedule)
router.get('/get-details/:id',getBusById)
router.get('/get-buses',getAllSchedules)


module.exports = router;