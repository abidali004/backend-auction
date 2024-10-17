const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const productsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    startPrice: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
        required: true,
    }],
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    isSold: {
        type: Boolean,
        default: false,

    }


})
const Products = mongoose.model('products', productsSchema)
module.exports = Products