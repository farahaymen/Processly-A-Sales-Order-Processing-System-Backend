const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
  name: {
    type: 'String',
    required: true
  },
  price: {
    type: 'Number',
    required: true
  },
  imgUrl: {
    type: 'String',
    required: false
  },
  sizes: [{
    type: 'String',
    required: false
  }]
});

const ProductModel = model('product', ProductSchema);

module.exports = ProductModel;
