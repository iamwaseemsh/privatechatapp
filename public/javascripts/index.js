const chatForm=document.getElementById("chat-form");
const chatMessages=document.querySelector(".chat-messages")


const socket=io("/");
const currentUsername=getCurrentUser(document.cookie);
const {username,roomid}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})


socket.emit("joinRoom",{currentUsername,roomid})
socket.on("message",message=>{
    outputMessage(message);
    chatMessages.scrollTop=chatMessages.scrollHeight;
})
socket.on("output",(messages)=>{
   
if(messages.length){

    for(var x=0;x<messages.length;x++){
      const div=document.createElement("div");
      div.classList.add('message')
      const p=document.createElement("p");
      p.innerText=" : " +messages[x].message;
      p.classList.add("message-text")
      const para=document.createElement("p");
      para.innerHTML=messages[x].user
      para.classList.add("message-user" )
      div.append(para)
      div.append(p);
      document.querySelector(".chat-messages").append(div)
      

    }
}

chatMessages.scrollTop=chatMessages.scrollHeight;

})

chatForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    let msg=e.target.elements.message.value
    console.log(msg);
    if(!msg){
        return false;
    }
    socket.emit("message",{currentUsername,roomid,msg});
    e.target.elements.message.value="";
    e.target.elements.message.focus();
})


function getCurrentUser(cookie){
    user=cookie.split("=")[1];
    return user;
}