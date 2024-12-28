const mongoose = require('mongoose');
const {Schema} = mongoose;
const blogSchema= new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
});

module.exports=mongoose.model('Blog',blogSchema);