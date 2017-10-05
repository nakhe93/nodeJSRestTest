var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

var roomno = 1;
io.on('connection', function(socket) {
  console.log('A user connected');
/*
  setTimeout(function(){
    console.log('send data 2');
    socket.emit('second', {description: 'second event' , name: 'second'})
  },4000);*/
  if(io.nsps['/'].adapter.rooms["roomno"+roomno] && io.nsps['/'].adapter.rooms["roomno"+roomno].length > 1){
    roomno++;
        
  }
    
  socket.join("roomno"+roomno);
  
  io.sockets.in("roomno"+roomno).emit('connectroom',roomno + "You are in roomno " + roomno);
  

  socket.on('clientEvent', function(data) {
    console.log(data);
    if(data == "kill"){
      socket.emit('first', {description: 'trigger event' , name: 'first'});
      socket.broadcast.emit('first', {description: 'first event' , name: 'first'});
    }
      
    else{
      socket.emit('first', {description: 'trigger event' , name: 'second'})
      socket.broadcast.emit('first', {description: 'second event' , name: 'second'});      
    }

  });
    //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
    
    socket.leave("roomno"+roomno);

    if(io.nsps['/'].adapter.rooms["roomno"+roomno] && io.nsps['/'].adapter.rooms["roomno"+roomno].length <= 1){
      roomno--;
    }
  
 });
/*
  setTimeout(function(){
    console.log('send data 1');
    socket.emit('first', {description: 'first event' , name: 'first'})
  },2000);
  
  */
})

http.listen(3000,"192.168.0.7",function(){
  console.log("listening on 3000");
});

