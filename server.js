if (process.env.NODE_ENV !=="production" ) {
    require("dotenv").config()
}
//importing libs
const mongoose=require('mongoose')
const Usermodel=require('./models/userModel')
const bodyParser=require("body-parser")
const express =require('express')
const app =express()
const bcrypt =require("bcrypt")
const nodemailer=require("nodemailer")
const JWT =require('jsonwebtoken')




const connectDB = require('./config/db')
connectDB()


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false})) 
app.set('view engine', 'ejs');




//configuring the login post
app.post("/login", async function(req, res){
  try {
      // check if the user exists
      const user = await Usermodel.findOne({ email: req.body.email });
      if (user) {
        //check if password matches
        const result = req.body.password === user.password;
        if (result) {
          res.redirect('/homepage');
        } else {
          res.redirect('/login');
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
});



app.post("/register",async(req,res)=>{
    let id=Date.now().toString()
    let username=req.body.username
    let email=req.body.email
    let password=req.body.password
    // console.log(req.body)
    const token = await JWT.sign({
      email,
      username,
      id
  },"lkjhgfdsghjnbvcx",{
      expiresIn:3600000
  })
    //hash the password for security we use bcrypt
//the most salt we add the secure our password 
const hashedpassword = await bcrypt.hash(password,10);
const user=await Usermodel.findOne({email:email})
if(user){
 return res.status(200).send({msg:"Email already used"})
}


  if(id=="" || username=="" ||email==""||password==""){
      res.json({message:'Enter data please'})
  }
  else{
      let user = new Usermodel({
        id:id,
          username:username,
          email:email,
          password:password
      })
  
      user.save().then(user=>console.log('user created')).catch(err=>console.log(err.message))
      if (user){
          res.redirect('/login')
      }
      else{
          res.json({message:'err'})
      }
      // console.log(req.body)
  }
}
)







app.post('/forgotpass', (req, res) => {
    let email = req.body.email;
// Check if the email exists in the db
const user = Usermodel.find(email);
if (!user){
 return res.status(404).json({ error: 'User not found' })
}

// Generate a new password and update it in the JSON file
const newPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
user.password = newPassword;

// Send the new password to the user via email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:process.env.AUTHNAME,
    pass:process.env.AUTHPASS
  }
});
const mailOptions = {
  from:process.env.AUTHNAME,
  to: email,
  subject: 'New Password for Your Account',
  text: `Your new password is ${newPassword}. Please use it and change your password.`
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to send email' });
  } else {
    console.log('Email sent: ' + info.response);
    // res.status(200).json({ message: 'New password sent to your email' });
     res.redirect('/resetpass')
  }
})
});





app.post('/resetpass',async(req,res)=>{
  let email=req.body.email
  let newpassword=req.body.newpassword
  let confirmpassword=req.body.confirmpassword
  if(newpassword===confirmpassword){
  let Updateduser=await Usermodel.findOneAndUpdate({email},({password:newpassword}))
  if(Updateduser){
      return res.redirect('/login')
  }
  else{
      res.json('No such User Found')
  }
  }
  else{
    res.send('Password does not match')
  }
  
})


// Defining routes
app.get('/homepage',(req,res)=>{
    res.render("index.ejs")
})
app.get('/login',(req,res)=>{
    res.render("login.ejs")
}) 
app.get('/register',(req,res)=>{
    res.render("register.ejs")
}) 
app.get('/forgotpass',(req,res)=>{
    res.render("forgotpass")
})
app.get('/resetpass',(req,res)=>{
  res.render("resetpass")
})
//end routes


 app.listen(8000,()=>{
      console.log('server running on 8000')
})

