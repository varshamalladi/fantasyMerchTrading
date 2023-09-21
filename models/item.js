const mongoose = require('mongoose');
//require('mongoose-type-url');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {type: String, required: [true, 'Item name is required']},
    category: {type: String, required: [true, 'Category is required']},
    description: {type: String, required: [true, 'Item Description is required'], 
                    minLength: [10, 'Description should atleast have 10 characters']},
    imageurl: {type: String, required: [true, 'Image url is required']},
    tradedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    condition: {type: String, required: [true, 'Item Condition is required'], 
                    enum: ['excellent', 'good', 'moderate', 'bad', 'very bad']},
    status: {type: String},
    watchedBy: [{type: Schema.Types.ObjectId, ref: 'User'}]
},
{timestamps: true}
);

//collection name is items in database
module.exports = mongoose.model('Item', itemSchema);