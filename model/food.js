let mongoose = require('mongoose')

let foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },

    menu_id: {
        type: String,
        required: true,
        unique: true,

    },

    prices: [{
        type: String,
        required: true,
    }],

  }, {timestamps: true})



let Food  = mongoose.model('Food', foodSchema)

module.exports = Food