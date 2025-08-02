const busModel = require("../models/busModel");
const ticketModel = require("../models/ticketModel");

exports.postTicket = async (req, res) => {
  try {
    const {
      name,
      company,
      from,
      to,
      date,
      departureTime,
      fare,
      selectedSeats,
      id, // Bus ID
    } = req.body;

    // Create ticket
    const ticket = await ticketModel.create({
      name,
      company,
      from,
      to,
      date,
      departureTime,
      fare,
      seats: selectedSeats,
    });

    await busModel.updateOne(
      { _id: id },
      {
        $set: {
          "seats.$[elem].isBooked": true,
        },
      },
      {
        arrayFilters: [
          { "elem.seatNumber": { $in: selectedSeats } },
        ],
      }
    );

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error booking ticket:", error);
    res.status(500).json({ message: "Failed to book ticket" });
  }
};


