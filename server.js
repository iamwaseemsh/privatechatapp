if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const cookieParser = require('cookie-parser');
const express = require("express");
const {
    RoomChat
} = require('./models/roomChat');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

const userRouter = require("./routes/user")
const searchRoute = require("./routes/search");
const chatRoute = require("./routes/chat");
const {
    SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION
} = require('constants');
const {
    chatAuth
} = require('./util');
const room = require('./models/room');



app.use(cookieParser());
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: false
}));



mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection

db.on("error", err => console.log(err));
db.once("open", () => console.log("Connected with mongoose"))

app.use("/", userRouter);
app.use("/search", searchRoute);
app.use("/chat", chatRoute)

io.on("connection", (socket) => {
    socket.on("joinRoom", ({
        currentUsername,
        roomid
    }) => {
        socket.join(roomid);
        const uj = {
            user: "Chatbot",
            message: `${currentUsername} has join the chat`
        }
        socket.broadcast.to(roomid).emit("output", [uj])
        RoomChat.findOne({
            roomId: roomid,
            username: currentUsername
        }, (err, data) => {
            if (err) {
                console.log("err is " + err);
            }
            if (data) {
                const messages = data.messages;
                io.to(socket.id).emit("output", messages)
            }
        });
        console.log("User connected");
    });
    socket.on("message", async ({
        currentUsername,
        roomid,
        msg
    }) => {
        const chat = await RoomChat.find({
            roomId: roomid,
            username:currentUsername
        });
        const message = {
            user: currentUsername,
            message: msg
        }
        
        if (chat.length > 0) {

            chat[0].messages.push(message);
            chat[0].save();

            chat[1].messages.push(message);
            chat[1].save();
            io.to(roomid).emit("output", [message])


        } else {
            try {
                const chat1 = new RoomChat({
                    roomId: roomid,
                    username: currentUsername,
                    messages: [message]
                })
                const newChat = await chat1.save();


            } catch {

            }


            try {
                console.log(roomid);
                const nun = roomid.replace(currentUsername, "");
                console.log(nun.length);
                const chat2 = new RoomChat({
                    roomId: roomid,
                    username: nun,
                    messages: [message]
                })
                const newChat2 = await chat2.save();
            } catch {

            }

            io.to(roomid).emit("output", [message])
        }

    })
    socket.on("disconnect", () => {

        console.log("User disconnected");
    })

})




server.listen(process.env.PORT || 3000)