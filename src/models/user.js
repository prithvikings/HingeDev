const mongoose=require('mongoose');
const {Schema}=mongoose;
const userSchema= new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    age:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
});

module.exports=mongoose.model('User',userSchema);