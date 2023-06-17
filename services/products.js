const { ObjectId } = require('mongoose').Types;

const ProductModel = require('../models/Product');

module.exports.findAllProducts = async () => {
  try {
    const products = await ProductModel.find();
    return products;
  } catch (err) {
    throw new Error('Could not retrieve products.');
  }
};

module.exports.findProductById = async (productId) => {
  try {
    const product = await ProductModel.findById(productId)
    return product;
  } catch (err) {
    throw new Error('Could not find product.');
  }
};

module.exports.addNewProduct = async (productInfo) => {
  try {
    
      let product = new ProductModel({
        name: productInfo.name,
        price: productInfo.price,
        imgUrl: productInfo.imgUrl,
        sizes:productInfo.sizes == null?[]:productInfo.sizes.split(',') 
      });
  
    const createdProduct = await product.save();
    return createdProduct;
  } catch (err) {
    throw new Error('Could not create product.');
  }
};

module.exports.removeProduct = async (productId) => {
  try {
    
    await ProductModel.deleteOne({ _id: productId });
  } catch (err) {
    throw new Error('Could not remove product.');
  }
};

module.exports.removeProductByName = async (req) => {
  try {
    const product = await ProductModel.findOne(
      {'name':req.body.name}

    )
    await ProductModel.deleteOne(product);
  } catch (err) {
    throw new Error('Could not remove product.');
  }
};



module.exports.editProduct = async (req) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.query.productId,
      { name: req.body.name, price: req.body.price,  imgUrl: req.body.imgUrl, sizes: req.body.sizes},
      { returnDocument: "after" }
    );
    return product;
  } catch (err) {
    throw new Error("Could not update Product .", err);
  }
};

module.exports.editProductByName = async (req) => {
  try {
    const product = await ProductModel.findOneAndUpdate(
      req.body.name,
      { name: req.body.name, price: req.body.price,  imgUrl: req.body.imgUrl, sizes: req.body.sizes},
      { returnDocument: "after" }
    );
    console.log(product)
    return product;
  } catch (err) {
    throw new Error("Could not update Product .", err);
  }
};