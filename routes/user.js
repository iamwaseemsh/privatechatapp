const express=require('express');
const cookieParser = require('cookie-parser');
const router=express.Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken")
if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}
const app2=express();
app2.use(cookieParser());

router.get("/",async(req,res)=>{
    res.render("users/signin");
});

router.post("/signin",async(req,res)=>{
    if(req.body.username==""){
        return res.render("users/signin",{errorMessage:"Username should not be empty"});
    }
    if(req.body.password==""){
        return res.render("users/signin",{errorMessage:"Password field should not be empty"});
    }
    try {
        const user=await User.findOne({username:req.body.username,password:req.body.password});
        if(user){
        //     const token=getToken(user);
        //    console.log(token);
        // res.cookie("userInfo",{username:req.body.username,token:getToken(user)})
        //    res.cookie("token",getToken(user))
            res.cookie("username",req.body.username).render("users/search");
          
        // res.render("users/search");
        }else{
            res.render("users/signin",{errorMessage:"Username or password invalid"})
        }
    } catch {
        res.render("users/signin",{errorMessage:"Username or password invalid"})
    }
   
});
const getToken=(user)=>{
   
    return jwt.sign(
       user,
        process.env.JWT.SECRET,{expiresIn:"24h"}
    )}
router.get("/register",async(req,res)=>{
    res.render("users/register");
});


router.post("/register",async(req,res)=>{
    if(req.body.username==""){
        return res.render("users/register",{errorMessage:"Username should not be empty"});
    }
    if(req.body.password==""){
        return res.render("users/register",{errorMessage:"Password should not be empty"});
    }
    if(req.body.password2==""){
        return res.render("users/register",{errorMessage:"Confirm password should not be empty"});
    }
    if(req.body.password!=req.body.password2){
        return res.render("users/register",{errorMessage:"Password does not match"});
    }

    const user= new User({
        username:req.body.username,
        password:req.body.password
    });
    
   try {
    const newUser=await user.save();
    res.cookie("user",{username:req.body.username},{expires:new Date()+86000*1000})

 
    
    res.render("users/search")
   } catch {
    res.render("users/register",{errorMessage:"Username already found",user:{username:req.body.username,password:req.body.password}})
   }
    
})


module.exports=router;