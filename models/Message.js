
// mongoose model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MsgSchema = new Schema({
   
    name:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    }
    
});

const ModelClass = mongoose.model('messages', MsgSchema);

module.exports = ModelClass;
