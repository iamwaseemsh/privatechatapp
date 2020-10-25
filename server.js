if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}
const cookieParser = require('cookie-parser');
const express=require("express");
const app=express();
const server=require("http").Server(app);
const io=require("socket.io")(server);
const bodyParser=require("body-parser");
const mongoose=require('mongoose');
const expressLayouts=require('express-ejs-layouts');

const userRouter=require("./routes/user")
const searchRoute=require("./routes/search");
const chatRoute=require("./routes/chat");

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
app.use("/chat",chatRoute);


// app.listen(process.env.PORT || 3000);
server.listen(process.env.PORT)