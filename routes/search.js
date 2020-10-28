const express = require('express');
const router = express.Router();
const Room = require("../models/room");
const User = require("../models/user");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const {
    getToken,
    searchAuth
} = require("../util");
const user = require('../models/user');


router.post("/", async (req, res) => {

    const data = await Room.find({
        $or: [{
            user1: req.cookies.username
        }, {
            user2: req.cookies.username
        }]
    });
    if (data) {
        var contacts = data.map((contact) => {
            var c = "";
            if (contact.user1 == req.cookies.username) {
                c = contact.user2
            } else {
                c = contact.user1
            }
            return {
                other: c,
                roomId: contact.roomId
            }
        })
    }

    if (req.body.username.toLowerCase() == req.cookies.username) {

        if (contacts) {
            return res.render("users/search", {
                errorMessage: "In valid username",
                contacts: contacts
            })
        } else {
            return res.render("users/search", {
                errorMessage: "In valid username"
            })
        }

    }
    if (req.body.username.toLowerCase() == "") {
        if (contacts) {
            return res.render("users/search", {
                errorMessage: "Username can't be empty",
                contacts: contacts
            })
        } else {
            return res.render("users/search", {
                errorMessage: "Username can't be empty"
            })
        }

    }

    const foundUser = await User.findOne({
        username: req.body.username.toLowerCase()
    });
    if (foundUser) {
        const currentUser = req.cookies.username;
        const nextUser = req.body.username.toLowerCase();
        const roomId = createRoom(currentUser, nextUser);
        try {
            const room = await Room.findOne({
                roomId: roomId
            });
            if (!room) {
                const room = new Room({
                    user1: currentUser,
                    user2: nextUser,
                    roomId: roomId
                });

                const newRoom = await room.save();

                res.redirect(`/chat?username=${nextUser}&roomid=${roomId}`);
            } else {
                res.redirect(`/chat?username=${nextUser}&roomid=${roomId}`);
            }

        } catch {
            res.redirect("/")

        }
    } else {

        if (contacts) {
            res.render("users/search", {
                errorMessage: "Username not found",
                contacts: contacts
            });
        } else {
            res.render("users/search", {
                errorMessage: "Username not found"
            })
        }


    }




})

router.get("/", searchAuth, async (req, res) => {

    const data = await Room.find({
        $or: [{
            user1: req.cookies.username
        }, {
            user2: req.cookies.username
        }]
    });


    if (data) {
        var contacts = data.map((contact) => {
            var c = "";
            if (contact.user1 == req.cookies.username) {
                c = contact.user2
            } else {
                c = contact.user1
            }
            return {
                other: c,
                roomId: contact.roomId
            }
        })
        res.render("users/search", {
            contacts: contacts
        });

    } else {
        res.render("users/search")
    }

})



function createRoom(currentUser, nextUser) {
    var roomId = "";
    if (currentUser > nextUser) {
        roomId = nextUser + currentUser;
    } else {
        roomId = currentUser + nextUser;
    }
    return roomId;
}

module.exports = router;