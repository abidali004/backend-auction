const mongoose = require('mongoose')
// const { types } = require('web3')

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // phone: {
    //     type: String,
    //     default: null
    // },
    // address: {
    //     type: String,
    //     default: null
    // },
    // photo: {
    //     type: String,
    //     default: null
    // },
    // role: {
    //     type: String,
    //     enum: ['admin', 'user'],
    //     default: 'user'
    // }
})

const User = mongoose.model('User', userSchema)
module.exports = User