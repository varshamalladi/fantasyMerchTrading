const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const offerSchema = new Schema({
    tradingItem: {type: Schema.Types.ObjectId, ref: 'Item'},
    receivingItem: {type: Schema.Types.ObjectId, ref: 'Item'},
    tradingUser: {type: Schema.Types.ObjectId, ref: 'User'},
    receivingUser: {type: Schema.Types.ObjectId, ref: 'User'}
},
{timestamps: true}
);

module.exports = mongoose.model('Offer', offerSchema);