if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const {userJoin,getUser,userLeave,getUserByUsername}=require("./users");
const cookieParser = require('cookie-parser');
const express = require("express");
const RoomChat= require('./models/roomChat');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const moment = require("moment");
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
    useCreateIndex: true,
    useUnifiedTopology:true
});
const db = mongoose.connection

db.on("error", err => console.log(err));
db.once("open", () => console.log("Connected with mongoose"))

app.use("/", userRouter);
app.use("/search", searchRoute);
app.use("/chat", chatRoute)

io.on("connection", (socket) => {
    socket.on("joinRoom",async ({
        currentUsername,
        roomid
    }) => {

       
        
        socket.join(roomid);
        const uj = {
            user: "Chatbot",
            message: `${currentUsername} is online now`,
            time:`[${moment().format('MMM Do,h:mm a')}]`
        }
        socket.broadcast.to(roomid).emit("output", [uj]);
     
  
       
        RoomChat.findOne({
           roomId:roomid ,
           usernameData:currentUsername
        }, (err, data) => {
         
            if (err) {
                console.log("err is " + err);
            }
            if (data) {
                const users=userJoin(socket.id,currentUsername,roomid);
                io.to(roomid).emit("online",users);
                const messages = data.messages;
                io.to(socket.id).emit("output", messages)     
            }else{
                
            }
        });
        console.log("User connected");
    });

    socket.on("message", async ({
        currentUsername,
        roomid,
        msg,
        time
    }) => {
        const chat = await RoomChat.find({
            roomId: roomid
        });
        const message = {
            user: currentUsername,
            message: msg,
            time:`[${time}]`
        }
      
         if (chat.length>0) {
            
            chat[0].messages.push(message);
            chat[0].save();

            chat[1].messages.push(message);
            chat[1].save();
            io.to(roomid).emit("output", [message])


        } else {
            
            try {
                const chat1 = new RoomChat({
                    usernameData:currentUsername,
                        roomId:roomid,
                    messages: [message]
                });
                
                chat1.save();
           
            } catch(err) {
                console.log("err 1 is " + err);
            }
           
            try {
              
              const nun = roomid.replace(currentUsername, "");
                const chat2 = new RoomChat({
                    usernameData:nun,
                        roomId:roomid         ,
                    messages: [message]
                })
                
                chat2.save();
            } catch(err) {
                console.log("err 2 is " + err);
            }

            io.to(roomid).emit("output", [message])
        }

    })
    socket.on("disconnect", () => {
        const user=getUser(socket.id);
        const newUsers=  userLeave(socket.id)
     
       

     if(newUsers.length>0){
        
       io.to(user[0].roomid).emit("online",newUsers);
      
     }
      
        console.log("User disconnected");
    });

})




server.listen(process.env.PORT || 3000)