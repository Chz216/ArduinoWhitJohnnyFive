var express = require('express');
var app = express();
var io = require('socket.io')(app.listen(3000));
var five = require('johnny-five');

app.get('/', function (req,res) {
  	res.sendFile(__dirname + '/index.html');
});


var board = new five.Board();

board.on('ready', function () {
    var speed, commands;

    var array = new five.Leds([2, 13, 4]);

    commands = null;

    array.on();

    io.on('connection', function (socket) {

        socket.on('off', function (){
            array.off();
        });

        socket.on('on', function (){
            array.on();
        });

    });
});
