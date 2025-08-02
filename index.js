const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");
const cookieParser = require("cookie-parser");
const path = require('path')
const authRoute = require('./routes/authRoute')
const busRoute = require('./routes/busRoute')
const ticketRoute = require('./routes/ticketRoute')

require("dotenv").config();

connectDB();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: "GET,POST,PUT,DELETE",
    credentials: true, 
  })
);

app.use('/api/auth',authRoute)
app.use('/api/bus',busRoute)
app.use('/api/ticket',ticketRoute)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));