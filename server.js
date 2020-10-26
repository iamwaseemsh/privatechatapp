if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}

const cookieParser = require('cookie-parser');
const express=require("express");
const RoomChat = require('./models/roomChat');
const app=express();
const server=require("http").Server(app);
const io=require("socket.io")(server);
const bodyParser=require("body-parser");
const mongoose=require('mongoose');
const expressLayouts=require('express-ejs-layouts');

const userRouter=require("./routes/user")
const searchRoute=require("./routes/search");
const chatRoute=require("./routes/chat");
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
const { chatAuth } = require('./util');



app.use(cookieParser());
app.set('view engine','ejs');
app.set("views",__dirname + "/views");
app.set("layout","layouts/layout");
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));



mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true});
const db=mongoose.connection

db.on("error",err=>console.log(err));
db.once("open",()=>console.log("Connected with mongoose"))

app.use("/",userRouter);
app.use("/search",searchRoute);



app.get("/chat",chatAuth,async(req,res)=>{

    if(!(req.query.username)){
    return res.redirect("/");
    }
  
  
   res.render("chats/chat")
    
});

io.on("connection",(socket)=>{
    socket.on("joinRoom",({currentUsername,roomid})=>{
        socket.join(roomid);
        const uj={user:"Chatbot",message:`${currentUsername} has join the chat`}
        socket.broadcast.to(roomid).emit("output",[uj])
        RoomChat.findOne({roomId:roomid},(err,data)=>{
            if(data){
                const messages=data.messages;
                // io.to(roomid).emit("output",messages)
                io.to(socket.id).emit("output",messages)
            }
        });
        console.log("User connected");
    });
    socket.on("message",async({currentUsername,roomid,msg})=>{
        const chat=await RoomChat.findOne({roomId:roomid});
        const message={
            user:currentUsername,
            message:msg
        }
        if(chat){
      
          chat.messages.push(message);
            chat.save();
          io.to(roomid).emit("output",[message])
         

        }else{
            console.log("Here");
            const chat=new RoomChat({
                roomId:roomid,
                messages:[message]
            })
            chat.save();
            io.to(roomid).emit("output",[message])
        }

    })
    socket.on("disconnect",()=>{
        // const uj={user:"Chatbot",message:`User has left the chat`}
        // socket.broadcast.to(roomid).emit("output",[uj])
        console.log("User disconnected");
    })
        
})






// app.listen(process.env.PORT || 3000);
server.listen(process.env.PORT || 3000)