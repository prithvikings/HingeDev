const mongoose=require('mongoose');
const connectdb=async()=>{
   await mongoose.connect(
    "mongodb+srv://prithvi07raj07:bdcuUDZnW0npZ9P8@start.6imen.mongodb.net/"
    );
};

connectdb()
.then(()=>{
    console.log("connected to database");
})
.catch(err=>{
    console.log(err);
})