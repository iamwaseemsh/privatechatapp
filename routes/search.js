const express=require('express');
const router=express.Router();
const Room=require("../models/room");
const User=require("../models/user");

const jwt=require("jsonwebtoken");
const {getToken,searchAuth}=require("../util")
// function searchAuth(req,res,next){
//     const token=req.cookies.token;
//     if(token){
//         jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
//             if(err){
//                return res.render("users/signin",{errorMessage:"Token is invalid"})

//             }
//             req.user=decode;
//             next();
//         return;
//         })
        
//     }
//     else{
//         return res.render("users/signin")

//     }
//     }
    
router.post("/",async(req,res)=>{
console.log(req.body.username);
if(req.body.username==req.cookies.username){
    return res.render("users/search",{errorMessage:"In valid username"})
}
if(req.body.username==""){
    return res.render("users/search",{errorMessage:"Username can't be empty"})
}

const foundUser=await User.findOne({username:req.body.username});

if(foundUser){
    const currentUser=req.cookies.username;
    
    const nextUser=req.body.username;
    const roomId=createRoom(currentUser,nextUser);
    
    try {
        const room=await Room.findOne({roomId:roomId});
        if(!room){
            const room=new Room({
                user1:currentUser,
                user2:nextUser,
                roomId:roomId
            })
            const newRoom=await room.save();
            
         res.redirect(`/chat?username=${nextUser}&roomid=${roomId}`);
        }else{
            res.redirect(`/chat?username=${nextUser}&roomid=${roomId}`);
        }
       
    } catch  {
        console.log("here");
        res.redirect("/")
        
    }
}
else{
    return res.render("users/search",{errorMessage:"Username not found"})
}




})

router.get("/",searchAuth,(req,res)=>{
    res.render("users/search")
})

function createRoom(currentUser,nextUser){
    var roomId="";
    if(currentUser>nextUser){
        roomId=nextUser+currentUser;
    }else{
        roomId=currentUser+nextUser;
    }
    return roomId;
}

module.exports=router;