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



app.use(cookieParser());
app.set('view engine','ejs');
app.set("views",__dirname + "/views");
app.set("layout","layouts/layout");
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

var userData={username:"",roomId:""}

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true});
const db=mongoose.connection

db.on("error",err=>console.log(err));
db.once("open",()=>console.log("Connected with mongoose"))

app.use("/",userRouter);
app.use("/search",searchRoute);
// app.use("/chat",chatRoute);

app.get("/chat",async(req,res)=>{
   userData.username=await req.query.username;
   userData.roomId=await req.query.roomid;
  
   res.render("chats/chat")
    
});

io.on("connection",(socket)=>{
    
    // try {
    //     const chat=await RoomChat.findOne({roomId:req.query.roomid});
    // if(chat){
    //    
    // }
    // } catch  {
    //     console.log("errors");
    // }
    

    
    socket.on("joinRoom",({currentUsername,roomid})=>{
        socket.join(roomid);
        RoomChat.findOne({roomId:roomid},(err,data)=>{
            if(data){
                const messages=data.messages;
                io.to(roomid).emit("output",messages)
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
        //     console.log(chat.messages);
          chat.messages.push(message);
        //    RoomChat.updateOne({roomId:roomid},{$push:{}})
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
        console.log("User disconnected");
    })
        
})






// app.listen(process.env.PORT || 3000);
server.listen(process.env.PORT || 3000)