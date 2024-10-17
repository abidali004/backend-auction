const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const bidsSchema = mongoose.Schema({

    offerBidPrice: {
        type: Number,
        required: true,
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
    }
})
const Bids = mongoose.model('bid', bidsSchema)
module.exports = Bids;