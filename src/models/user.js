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
        unique:true,
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
        min:18,
        max:65
    },
    gender:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(value!=='male'&&value!=='female'){
                throw new Error('Gender must be male or female');
            }else{
                return true;
            }
        }
    },
    photourl:{
        type:String
    },
    about:{
        type:String,
        default:"This is a user"
    },
    skills:{
        type:[String]
    }
},
{
    timestamps:true
});

module.exports=mongoose.model('User',userSchema);