import  mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname : {
        type:String,  
        trim:true,
        required:true 
    },
    mobile : {
        type:String, 
        trim:true,
        required:true 
    },
    email : {
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },    
    password : {
        type:String,
        required:true,
        trim:true,
        
    },
    role: {
        type:String,
        enum:["user","admin","rider"],
        trim:true,
        required:true
        
    }
}, { timestamps: true})

const user = mongoose.model("User", userSchema);
export default user;
