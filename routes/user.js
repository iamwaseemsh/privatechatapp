const {getToken}=require("../util")
const express=require('express');
const cookieParser = require('cookie-parser');
const router=express.Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");

if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}
const app2=express();
app2.use(cookieParser());
function isAuth(req,res,next){
    const token=req.cookies.token;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err){
               return res.render("users/signin")

            }
            req.user=decode;
            next();
        return;
        })
        
    }
    else{
        return res.render("users/signin")

    }
    }
router.get("/",isAuth,async(req,res)=>{

    res.redirect("/search");
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
        //console.log("Token is here" + getToken(user));
        res.cookie("token",getToken(user));
        res.cookie("username",req.body.username);
            res.redirect("/search");
          
        // res.render("users/search");
        }else{
            res.render("users/signin",{errorMessage:"Username or password invalid"})
        }
    } catch {
        res.render("users/signin",{errorMessage:"Username or password invalid"})
    }
   
});

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

    //res.cookie("user",{username:req.body.username},{expires:new Date()+86000*1000})

 
    
    res.render("users/search")
   } catch {
    res.render("users/register",{errorMessage:"Username already found",user:{username:req.body.username,password:req.body.password}})
   }
    
})

router.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.clearCookie("username");
    res.redirect("/")
})


module.exports=router;