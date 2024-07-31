const Product = require('../Model/productModel');

exports.getProducts = async (req, res) => {
  try {
    const { name, price, category } = req.query;
    let filter = {};

    if (name) {
      filter.product_name = { $regex: name, $options: 'i' };
    }
    if (price) {
      filter.price = { $lte: price };
    }
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).limit(20);
    res.render('home', { products });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
