const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({

    sender: {
        type: String,
        default: null,
    },
    recipientId: {
        type: String,
        default: null,
    },
    content: {
        type: String,
        required: true,

    },
    isRead: {
        type: Boolean,
        required: true,
    },
    productId: {
        type: String,
        required: true,

    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
})

const Message = mongoose.model('message', messageSchema)
module.exports = Message