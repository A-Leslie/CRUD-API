const mongoose=require('mongoose')
const Usermodel=mongoose.Schema
const user = new Usermodel({
    id:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model('user',user)