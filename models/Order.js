const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
   
    status: {
        type:Number,
       
    },
    iname: {
        type: String,
       
    },
    iimg: {
        type: String,
        
    },
    itype: {
        type: String,
       
    },
    ufname: {
        type: String,
       
    },
    ulname: {
        type: String,
        
    },
    uemail: {
        type: String,
        
    },
    uphone: {
        type: String,
      
    },
    eid: {
        type: Number,
        
    },
    efname: {
        type: String,
       
    },
    elname: {
        type: String,
       
    },
    eemail: {
        type: String,
       
    },
    ephone: {
        type: String,
        
    },
    ord_name: {
        type: String,
       
    },
    ord_email: {
        type: String,
        
    },
    ord_phone: {
        type: String,
       
    },
    ord_address1: {
        type: String,
       
    },
    ord_address2: {
        type: String,
        
    },
    ord_state: {
        type: String,
       
    },
    ord_pincode: {
        type: String,
      
    },
    ord_date: {
        type: String,
      
    },
    id: {
        type: Number,
       
    },
    cost: {
        type: String,
       
    }

});

const ModelClass = mongoose.model('orders', OrderSchema);

module.exports = ModelClass;