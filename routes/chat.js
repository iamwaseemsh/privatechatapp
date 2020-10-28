const express = require("express");
const {
    chatAuth
} = require("../util");
const router = express.Router();
const ChatRoom = require("../models/roomChat");
const {
    RoomChat
} = require("../models/roomChat");

router.get("/", chatAuth, (req, res) => {
    if (!(req.query.username)) {
        return res.redirect("/");
    }

    res.render("chats/chat",{hhh:req.query.username})
});

router.get("/delete/:username", (req, res) => {
    RoomChat.findOne({
        username: req.params.username.toLowerCase()
    }, async (err, data) => {
        if (err) {

        }
        if (data.messages.length > 0) {
            data.messages = [];
            const dw = await data.save();
            res.redirect("/");
        }

    })

})

module.exports = router;