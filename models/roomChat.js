const mongoose=require("mongoose");


const messageSchema=new mongoose.Schema({
    user:{
        type:String,
        required:true
    },message:{
        type:String,
        required:true
    },date:{
        type:Date,
        default:Date.now
    }
})



const roomChatSchema=new mongoose.Schema({
    roomId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
    },
    messages:[messageSchema],
  
})
const RoomChat=mongoose.model("RoomChat",roomChatSchema)
module.exports={RoomChat,roomChatSchema};
