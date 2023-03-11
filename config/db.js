const mongoose=require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery',true)
const connection = async()=>{
    try {
       const conn = await mongoose.connect(process.env.URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
       }) 
       console.log(`database connected to ${conn.connection.host}`);
    } catch (error) {
        console.log(error)
    }
}
module.exports=connection