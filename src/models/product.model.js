const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const m2s = require('mongoose-to-swagger');
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    img: {
      type: Object,
      required: false,
      private: true,
    },
    imgUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      private: true,
    },
    isSoldOut: {
      type: Boolean,
      default: () => this.count > 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
    categories: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);
/**
 * @typedef {Object} Product
 * @param
 */

/** @type {Product} */
const Product = mongoose.model('Product', productSchema);
// const swaggerSchema = m2s(Product);
// console.log('%j',swaggerSchema);
module.exports = Product;
