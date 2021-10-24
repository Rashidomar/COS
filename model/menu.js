let mongoose = require('mongoose')

let menuSchema = new mongoose.Schema({
    name: {

        type: String,
        required: true,

    }

  }, {timestamps: true})



let Menu  = mongoose.model('Menu', menuSchema)

module.exports = Menu