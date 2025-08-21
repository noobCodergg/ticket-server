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
      id, 
      userId
    } = req.body;

    console.log(id,userId)
    const ticket = await ticketModel.create({
      name,
      company,
      from,
      to,
      date,
      departureTime,
      fare,
      seats: selectedSeats,
      id,
      userId
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



exports.getTickets = async(req,res)=>{
   try{
    const {userId} = req.params;
    const tickets = await ticketModel.find({userId})
    console.log(tickets)
    res.status(200).json(tickets)
   }catch(error){
    res.status(500).json("Internal Server Error")
   }
}




exports.cancelTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { busId } = req.body;

  try {
    // Find the ticket
    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Find the bus
    const bus = await busModel.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Free the booked seats
    bus.seats.forEach(seat => {
      if (ticket.seats.includes(seat.seatNumber)) {
        seat.isBooked = false;
      }
    });

    await bus.save();

    
    await ticketModel.findByIdAndDelete(ticketId);

    

    res.status(200).json({ message: 'Ticket canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateStatus = async (req, res) => {
  const { ticketId } = req.params;

  try {
    
    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    
    let newStatus = null;
    if (ticket.isCancelled === false) newStatus = null;
    else if (ticket.isCancelled === null) newStatus = false;
    else newStatus = ticket.isCancelled; // true হলে change না করা

    const updatedTicket = await ticketModel.findByIdAndUpdate(
      ticketId,
      { isCancelled: newStatus },
      { new: true }
    );

    res.status(200).json({ message: 'Ticket status updated', ticket: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};



exports.getCancelledRequest = async(req,res) =>{
  try{
    const list = await ticketModel.find({isCancelled:false})
    res.status(200).json(list)
  }catch(error){
    res.status(500).json("Internal Server Error")
  }
}



