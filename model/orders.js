let mongoose = require('mongoose')

let orderSchema = new mongoose.Schema({
    menu: {
        type: String,
        required: true,

    },

    food: {
        type: String,
        required: true,
        unique: true,
    },

    price: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
        unique: true,
    },

    hall: {
        type: String,
        required: true,
    }, 
    
    contact: {
        type: String,
        required: true,
        unique: true,
    },

    room_number: {
        type: String,
        required: true,
    }

  }, {timestamps: true})



let Order  = mongoose.model('Order', orderSchema)

module.exports = Order