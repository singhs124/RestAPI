const mongoose = require('mongoose');
const order = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId ,
    productId:{
        type: mongoose.Schema.Types.ObjectId ,
        required: true
    },
    quantity:{
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model("Order", order);