const mongoose = require("mongoose");

//schema design
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'enter your name'],
    },
    email:{
        type:String,
        required:[true,'enter the correct email'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'enter your password'],
    },
},
{timestamps:true}
);

//export
const userModel = mongoose.model('users',userSchema)
module.exports = userModel