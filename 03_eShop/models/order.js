const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItems',
        required: true
    }],
    shippingAddress1: {
        type: String,
        requrired: true
    },
    shippingAddress2: {
        type: String,
    },
    city: {
        type: String,
        requrired: true
    },
    zip: {
        type: String,
        requrired: true
    },
    country: {
        type: String,
        requrired: true
    },
    phone: {
        type: String,
        requrired: true
    },
    status: {
        type: String,
        requrired: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

orderSchema.set('toJSON', {
    virtuals: true,
})

exports.Order = mongoose.model('Order', orderSchema);
