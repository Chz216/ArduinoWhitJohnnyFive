var express = require('express');
var app = express();
var io = require('socket.io')(app.listen(3000));
var five = require('johnny-five');

app.get('/', function (req,res) {
  	res.sendFile(__dirname + '/index.html');
});


var board = new five.Board({
  	repl:false
});

board.on('ready', function () {
    var speed, commands;
    var anode = new five.Led(13);

    commands = null;

    anode.on();

    io.on('connection', function (socket) {

        socket.on('off', function (){
            anode.off();  // to shut it off (stop doesn't mean "off")
        });

        socket.on('on', function (){
            anode.on(); // to turn on, but not blink
        });

    });
});
