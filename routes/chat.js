const express = require("express");
const {
    chatAuth
} = require("../util");
const router = express.Router();
const ChatRoom = require("../models/roomChat");
const 
    RoomChat
 = require("../models/roomChat");

router.get("/", chatAuth, (req, res) => {
    if (!(req.query.username)) {
        return res.redirect("/");
    }

    res.render("chats/chat",{hhh:req.query.username})
});

router.get("/delete", (req, res) => {
    console.log(req.query);
    RoomChat.findOne({
        usernameData: req.query.username.toLowerCase(),
        roomId:req.query.roomid
    }, async (err, data) => {
        if (err) {

        }
        if(data){
            
            data.messages=[];
            data.save();
            res.redirect("/");
        }

    })
  res.redirect("/");

})

module.exports = router;