const mongoose=require("mongoose");
// const Message=require("./message");

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
    messages:[messageSchema],
})
module.exports=mongoose.model("RoomChat",roomChatSchema);
