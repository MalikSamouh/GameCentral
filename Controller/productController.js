const Product = require('../Model/productModel');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { values } = req.body;
    const bulk = values.map(product => ({
      updateOne: {
        filter: { product_name: product.product_name },
        update: { $set: { quantity_in_stock: product.quantity } }
      }
    }));
    const result = await Product.bulkWrite(bulk);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.removeProductsFromStock = async (req, res) => {
  try {
    const { order } = req.body;
    const bulk = order.map(orderedItem => ({
      updateOne: {
        filter: { product_name: orderedItem.product_name },
        update: { $inc: { quantity: -orderedItem.quantity } }
      }
    }));
    const result = await Product.bulkWrite(bulk);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
