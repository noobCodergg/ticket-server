const busModel = require("../models/busModel");

exports.createBusSchedule = async (req, res) => {
  try {
    const {
      coachNo,
      from,
      to,
      date,
      fare,
      seatCount,
      departureTime,
      company,
    } = req.body;

    console.log(coachNo,from,to,date,fare,seatCount,departureTime,company)

    // Generate seat numbers like A1, A2... B1, B2... etc.
    const seats = [];
    const rows = Math.ceil(seatCount / 4); // assuming 4 seats per row: A-D
    let seatNumber = 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 4; col++) {
        if (seatNumber > seatCount) break;

        const seatPrefix = String.fromCharCode(65 + row); // 'A', 'B', 'C', ...
        const seat = {
          seatNumber: `${seatPrefix}${col + 1}`,
          isBooked: false,
        };
        seats.push(seat);
        seatNumber++;
      }
    }

    const newSchedule = new busModel({
      coachNo,
      from,
      to,
      date,
      fare,
      seatCount,
      departureTime,
      company,
      seats,
    });

    await newSchedule.save();

    return res
      .status(201)
      .json({ message: "Bus schedule created successfully", schedule: newSchedule });
  } catch (error) {
    console.error("Error creating bus schedule:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.getBusById = async(req,res)=>{
  try{
    const {id} = req.params;
    console.log(id)
    const bus = await busModel.findById(id)
    console.log(bus)
    res.status(200).json(bus)
  }catch(error){
    res.status(500).json("Thisi is error")
  }
}

exports.getAllSchedules = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    const filter = {};

    if (from) filter.from = { $regex: new RegExp(from, 'i') };
    if (to) filter.to = { $regex: new RegExp(to, 'i') };
    if (date) filter.date = date;

   

    const schedules = await busModel.find(filter).sort({ date: 1 });
    
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


