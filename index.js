const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DateOnly = require('mongoose-dateonly')(mongoose);

const userModel = require('./models/userModel');
const foodModel = require('./models/foodModels');
const verifyToken = require("./verifyToken");
const trackingModel = require('./models/trackingModel');


//database Connection

mongoose.connect("mongodb://localhost:27017/Nutrify")
.then(() =>{
  console.log("Database connected");
})
.catch((err)=>{
  console.log(err);
})

const app = express();

app.use(express.json());  // middleware for req body data

//Endpoint for register user
app.post("/register",(req,res)=>{

  let user = req.body;

  bcrypt.genSalt(10,(err,salt)=>{
    if(!err)
    {
      bcrypt.hash(user.password,salt,async(err,hpass)=>{
        if(!err)
        {
          user.password = hpass;
          try{

            let doc = await userModel.create(user) //creates user in db
            res.status(201).send({message:"User Registered"});  
        
          }
          catch(err){
            console.log(err);
            res.status(500).send({message:"Some problem"});
        
          }
        }
      })
    }
  })

})

//Endpoint for login user
app.post("/login",async(req,res)=>{
     
  let userCred = req.body;
  
  try{
       const user = await userModel.findOne({email:userCred.email});
       if(user!=null)
      {
        bcrypt.compare(userCred.password,user.password,(err,success)=>{
          if(success==true){
            jwt.sign({email:userCred.email},"nutrifyapp",(err,token)=>{
              if(!err){
                res.send({message:"Login Success",token:token});
              }
              else{
                console.log(err);
                res.send("Some problem occurs")
              }
            })
          }
          else{
            res.status(403).send({message:"Incorrect Password"})
          }
        });
      } 
       
      else
       {
        res.send({message:"User not found"})
       }
  }
  catch(err){
    console.log(err);
    res.status(500).send({message:"Some problem"})
  }
})

//endpoint to fetch food

app.get("/foods",verifyToken,async(req,res)=>{

  try
  {
    let foods = await foodModel.find();
    res.send(foods);
  }
  catch(err){
    console.log(err);
    res.status(500).send({message:"some problem in find foods"})
  }
})

//endpoint to search food by name
app.get("/foods/:name",verifyToken,async(req,res)=>{


  try
  {

     let foods = await foodModel.find({name:{$regex:req.params.name,$options:'i'}})

     if(foods.length!==0){
      res.send(foods)

     }
     else{

      res.status(404).send({message:"Food not found"});


     }

     
  }
  catch(err)
  {
    console.log(err);
    res.status(500).send("Some problem in getting the food");
  }
})


//endpoint to track food
app.post("/track",verifyToken,async(req,res)=>{

  let trackData = req.body;

  try{
  let data = await trackingModel.create(trackData);
  res.status(201).send({message:"Food added"});
 }
 catch(err){
  
  console.log(err);
  res.status(500).send({message:"Some problem in getting the food"});

 }

})

//endpoint to fetch all foods eaten by a person

app.get("/track/:userid/:date", verifyToken, async (req, res) => {
  let userid  = req.params.userid;
  let date = req.params.date;
  let strDate = date.getDay()+"/"+date.getMonth()+1+"/"+date.getFullYear();

  try {
    const foods = await trackingModel.find({ userID: userid,eatenDate: strDate }).populate('userID').populate('foodID');

    res.send(foods);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Some problem occurred while getting the food" });
  }
});





app.listen(8000,()=>{
  console.log("Server is running on port 8000");
})