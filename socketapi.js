const socket = require("socket.io");

var io = require("socket.io")();

const socketapi = {
    io:io
};
 

var onlineuser = [];
io.on('connection', function(socket){
    console.log('user connected');
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });

    socket.on("msg",function(data){
        io.emit("mga",data)
    })
    onlineuser.push(socket.id);
    io.emit("online",onlineuser.length)
    socket.on("disconnect",function(){
        console.log("user disconnected")
        onlineuser.splice(onlineuser.indexOf(socket.id),1)
        io.emit("online",onlineuser.length)
    });
    
})


module.exports = socketapi;