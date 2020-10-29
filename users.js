var users=[];
function userJoin(id,username,room){
    const user={id,username,room};
    users.push(user);
    return user;

}

function getCurrentUser(username){
    return users.find(user=>user.username===username);
}
function userLeave(username){
    const index=users.findIndex(user=>user.username===username);
    if(index!==-1){
        return users.splice(index,1)[0];
    }
}
module.exports={
    userJoin,
    getCurrentUser,
    userLeave
}
