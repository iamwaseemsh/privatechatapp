const moment = require("moment");
const mongoose=require("mongoose");


const messageSchema=new mongoose.Schema({
    user:{
        type:String,
        required:true
    },message:{
        type:String,
        required:true
    },time:{
        type:String,
        default:`[${moment().format('MMM Do,h:mm a')}]`
    }
})



const roomChatSchema=new mongoose.Schema({

        usernameData:{
            type:String
        },
        roomId:{
            type:String,
          
            
        }

    ,
    messages:[messageSchema],
  
})
// roomChatSchema.plugin(require('mongoose-beautiful-unique-validation'));
// const RoomChat=mongoose.model("RoomChat",roomChatSchema)
// module.exports={RoomChat,roomChatSchema};
module.exports=mongoose.model("RoomChat",roomChatSchema)