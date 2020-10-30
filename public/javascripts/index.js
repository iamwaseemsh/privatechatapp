const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages")


const socket = io("/");
const currentUsername = getCurrentUser(document.cookie);
const {
    username,
    roomid
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


socket.emit("joinRoom", {
    currentUsername,
    roomid
})
document.getElementById("delete-chat-button").addEventListener("click", (e) => {
    e.preventDefault()
    var c = confirm("Are you sure?");
    if (c == true) {
        window.location.href = `chat/delete?username=${currentUsername}&roomid=${roomid}`;
    } else {
        return
    }
})

socket.on("message", message => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})
socket.on("online",users=>{
   console.log(users);
    const status=document.querySelector(".status");
    if(users){
       
        for(var x=0;x < users.length;x++){
            if(users[x].username==username){
                status.innerHTML="online";
                break;
            }else{
                status.innerHTML="";
            }
        }
    
    }

})

socket.on("output", (messages) => {
    
    console.log(moment().format('MMM Do,h:mm a'));
    if (messages.length) {
        
        for (var x = 0; x < messages.length; x++) {
            const div = document.createElement("div");
            const time=document.createElement("h6")
            time.classList.add("message-time");
            time.innerText=messages[x].time;
            div.classList.add('message')
            const p = document.createElement("p");

            p.classList.add("message-text")
            const para = document.createElement("p");
            if (messages[x].user == getCurrentUser(document.cookie)) {
                div.classList.add("sender-color")
                div.classList.add("message-right")
            } else {
                div.classList.add("receiver-color")
                div.classList.add("message-left")
            }
            p.innerText = " : " + messages[x].message;


            para.innerHTML = messages[x].user
            para.classList.add("message-user")


            p.prepend(para)
            p.append(time)
            div.append(p);
            
            document.querySelector(".chat-messages").append(div)


        }
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;

})

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let msg = e.target.elements.message.value
    console.log(msg);
    if (!msg) {
        return false;
    }
    const time=moment().format('MMM Do,h:mm a');
    socket.emit("message", {
        currentUsername,
        roomid,
        msg,
        time
        
    });
    e.target.elements.message.value = "";
    e.target.elements.message.focus();
})



function getCurrentUser(cookie) {
    user = cookie.split(";")
    if (user[0].includes("username")) {
        user = cookie.split(";")[0]
        user = user.split("=")[1];
        r
    } else {
        user = cookie.split(";")[1]
        user = user.split("=")[1];
        return decodeURIComponent(user);
    }

}