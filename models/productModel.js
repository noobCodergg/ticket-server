const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  seller:String,
  title:String,
  price:String,
  condition:String,
  image:String,
  status:Boolean,
  details:String,
  uploaded_by:String
});

const Product = mongoose.model("products", productSchema);

module.exports = Product;