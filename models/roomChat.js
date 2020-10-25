const mongoose=require("mongoose");
const Chat=require("./chat");

const roomChatSchema=new mongoose.Schema({
    roomId:{
        type:String,
        required:true
    },
    chats:[{
        type:Chat
    }]
})