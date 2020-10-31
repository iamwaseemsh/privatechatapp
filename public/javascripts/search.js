const socket=io("/");

const currentUsername=getCurrentUser(document.cookie);
const roomid="";
socket.emit("joinRoom",{
    currentUsername,
    roomid
});

socket.on("searchonline",users=>{
    
     const contacts=document.getElementsByClassName("contact");
   
    console.log("online users are",users);
    console.log("contacts are",contacts)
     for(var x=0;x<contacts.length;x++){
         for(var y=0;y<users.length;y++){
             if(contacts[x].innerHTML==users[y].username){
                 contacts[x].classList.add("online-status");
                 break;
             }else{
                contacts[x].classList.remove("online-status");
             }

         }
     }
    //  if(users){
        
    //      for(var x=0;x < users.length;x++){
    //          if(users[x].username==username){
    //              status.innerHTML="Online";
                 
    //              break;
    //          }else{
                 
    //              status.innerHTML="Offline";
    //          }
    //      }
     
    //  }
 
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