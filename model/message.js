let mongoose = require('mongoose')

let messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },

    contact: {
        type: String,
        required: true,

    },

    message: {
        type: String,
        required: true,
    },

  }, {timestamps: true})



let Message  = mongoose.model('Mesaage', messageSchema)

module.exports = Message