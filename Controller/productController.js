const Product = require('../Model/productModel');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find(filter).limit(20);
    res.render('home', { products });
    return products;
  } catch (error) {
    res.status(500).send(error);
  }
};
