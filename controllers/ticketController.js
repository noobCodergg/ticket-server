const busModel = require("../models/busModel");
const ticketModel = require("../models/ticketModel");
const userModel = require('../models/userModel')
const Trip = require("../models/tripModel")
const nodemailer = require("nodemailer");

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

    // 1. user fetch by userId
    const user = await userModel.findById(userId);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User email not found" });
    }

    // 2. create ticket
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

    // 3. update bus seat status
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

    // 4. nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail", // production এ চাইলে SMTP server use করো
      auth: {
        user: 'muntasirniloy2002@gmail.com',
        pass: 'neih ewru erye hfvg',
      },
    });

    const mailOptions = {
      from: `"Bus Service" `,
      to: user.email,
      subject: "Your Ticket Booking Confirmation",
      html: `
        <h2>Hello ${name},</h2>
        <p>Your ticket has been successfully booked!</p>
        <p><b>Journey Details:</b></p>
        <ul>
          <li><b>Company:</b> ${company}</li>
          <li><b>From:</b> ${from}</li>
          <li><b>To:</b> ${to}</li>
          <li><b>Date:</b> ${date}</li>
          <li><b>Departure Time:</b> ${departureTime}</li>
          <li><b>Seats:</b> ${selectedSeats.join(", ")}</li>
          <li><b>Fare:</b> ${fare} BDT</li>
        </ul>
        <p>Thank you for traveling with us 🚍</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // 5. response
    res.status(200).json({
      success: true,
      ticket,
      message: "Ticket booked and sent to user email"
    });

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
    else newStatus = ticket.isCancelled; 

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


exports.createTrip = async (req, res) => {
  try {
    const { userId, title, description, startDate, endDate, legs } = req.body.formData;

    console.log(userId,title,description,startDate,endDate,legs)
    const newTrip = new Trip({
      userId,
      title,
      description,
      startDate,
      endDate,
      legs,
    });

    // Save the new trip to the database
    const savedTrip = await newTrip.save();

    res.status(201).json({ success: true, data: savedTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getTrip = async(req,res)=>{
  try{
    const {userId} = req.params;

    const data = await Trip.find({userId})
    res.status(200).json(data)
    
  }catch(err){
    res.status(500).json("Internal server Error")
  }
}


exports.updateTrip = async (req, res) => {
  const { id } = req.params;
  const {data} = req.body;

  
  try {
    // Validate required fields (optional, you can skip if frontend ensures it)
    const { title, startDate, endDate, legs } = data;
    console.log(title,startDate,endDate,legs)
    if (!title || !startDate || !endDate || !legs) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find trip by ID and update
    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip updated successfully", data: updatedTrip });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.deleteTrip = async(req,res)=>{
  try{
       const {id} = req.params;

  await Trip.deleteOne({_id:id})
  }catch(error){
    console.log(error)
  }

}


exports.getDailySales = async (req, res) => {
  try {
    const result = await ticketModel.aggregate([
      {
        $match: { isCancelled: { $ne: true } } 
      },
      {
        $group: {
          _id: { company: "$company", date: "$date" },
          ticketsSold: { $sum: { $size: "$seats" } },
          revenue: { $sum: "$fare" } 
        }
      },
      {
        $project: {
          _id: 0,
          company: "$_id.company",
          date: "$_id.date",
          ticketsSold: 1,
          revenue: 1
        }
      },
      {
        $sort: { date: 1, company: 1 }
      }
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching daily sales:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};