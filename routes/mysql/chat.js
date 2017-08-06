module.exports = function(){

  var route = require('express').Router();
  var conn = require('../../config/mysql/db')();

  var http = require('http').Server(route);
  var io = require('socket.io')(http);

  route.get('/',function(req, res){
  //  res.sendFile(__dirname + "/index.html");
  res.sendfile('views/chat.html');
//      res.sendFile('clint', { root: 'views/mysql/topic' });
  //  res.sendFile('views/mysql/topic/clint');
  //    res.sendFile(path.resolve('views/mysql/topic/clint'));
  })
  io.on('connection', function(socket){
    socket.on('to message', function(msg){
      io.emit('from message', msg);
    });
  });

  return route;
}
