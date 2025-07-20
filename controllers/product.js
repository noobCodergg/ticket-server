const productModel = require('../models/productModel')
const fs = require('fs');
const path = require('path');

exports.uploadProduct = async (req, res) => {
  try {
    const { seller,title,  price, condition,status,details,uploaded_by } = req.body;
    const image = req.file;

    
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newBook = await productModel.create({
      seller,
      title,
      price,
      condition,
      image: image.path, 
      status,
      details,
      uploaded_by
    });

    res.status(200).json({
      message: "Product uploaded successfully",
      data: newBook,
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};


exports.getProductByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const search = req.query.search || ''; // get the search query from frontend

    const products = await productModel.find({
      uploaded_by: userId,
      title: { $regex: search, $options: 'i' } // case-insensitive search on title
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProductByUserId:", error);
    res.status(500).json("Internal Server Error");
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await productModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, price, details } = req.body;

  try {
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.title = title;
    product.price = price;
    product.details = details;

    if (req.file) {
      // Delete old image if it exists
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', product.image); // product.image stores "uploads/filename"
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      product.image = `uploads/${req.file.filename}`; // Store full relative path
    }

    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};


exports.getAllProducts = async (req, res) => {
  try {
    // Sort so that status false come first, true come later
    const products = await productModel.find().sort({ status: 1 }); 
    // assuming status is boolean and false < true, ascending order puts false first

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: err.message,
    });
  }
};




exports.updateProductStatus = async (req, res) => {
  const { id } = req.params; 
  

  try {
    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.status = true; // update status
    await product.save();

    res.status(200).json({ message: 'Product status updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};


exports.getProductByStatus = async (req, res) => {
  try {
    const search = req.query.search || '';

    const products = await productModel.find({
      status: true, 
      title: { $regex: search, $options: 'i' }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProductByUserId:", error);
    res.status(500).json("Internal Server Error");
  }
};







