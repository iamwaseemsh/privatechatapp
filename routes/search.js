const express=require('express');
const router=express.Router();
const Room=require("../models/room");
const User=require("../models/user");


router.post("/",async(req,res)=>{
console.log(req.cookies.username);
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
        res.send("catch")
        
    }
}
else{
    return res.render("users/search",{errorMessage:"Username not found"})
}




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