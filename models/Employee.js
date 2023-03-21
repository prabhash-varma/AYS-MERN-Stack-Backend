const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const EmployeeSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    profession:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    free:{
        type:Number,
        required:true
    }
});



EmployeeSchema.pre('save', async function(next) {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password,salt);
        this.password = hashedPassword;
        console.log("hashed password is :",hashedPassword);
        next();

    }
    catch(err){
        console.log(err);
    }
});

const ModelClass = mongoose.model('employees', EmployeeSchema);

module.exports = ModelClass;

