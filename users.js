var users=[];
function userJoin(id,username,roomid){
    
    users.push({id,username,roomid});
    console.log("Join users" , users);
    return users;

}


    
function userLeave(id){
    users=users.filter(user=>user.id!=id);
   
    return users;
    
}

function getUserByUsername(username){
   const user=users.filter(user=>username==username);
   return user;
}
function getUser(id){
    
    const user=users.filter(user=>user.id==id)
    
    return user;
}
module.exports={
    userJoin,
    userLeave,
    getUser,
    getUserByUsername
}
