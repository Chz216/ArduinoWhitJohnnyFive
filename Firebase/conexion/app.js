var express = require('express'); //se manda a llamar la libreria express
var app = express(); //se inicializa el metodo express
var io = require('socket.io')(app.listen(3000)); //esta linea es la que encarga de llamar la interfaz para el usuario mediante localhost:3000
var five = require('johnny-five'); //libreria de Johnny Five
var firebase = require('firebase'); //libreria de Firebase

var board = new five.Board();//detecta la placa de arduino y el puerto en el que se conecta

app.get('/', function (req,res) {
  	res.sendFile(__dirname + '/index.html');
});//llama de primer instancia nuestro archivo index.html al comento de escribir localhost:3000

var dataRef = firebase.initializeApp({
    databaseURL: "https://arduinofirebase-299f1.firebaseio.com",
});/// inicializa la conexion de nuestra aplicación con firebase hay que cambiar la url de firebase por una propia

//variales de los leds que esten conectados
var led1, led2, led3;

//se inicializan los leds en 0 simulando que estan apagados
var led1State = 0, led2State = 0, led3State = 0;

//Crear referencia
var dbRefObject = firebase.database().ref().child('datas');
var dbRefLed1 = dbRefObject.child('led1');
var dbRefLed2 = dbRefObject.child('led2');
var dbRefLed3 = dbRefObject.child('led3');

// reset firebase data
dataRef.database().ref('datas').set({
    'led1': led1State,
    'led2': led2State,
    'led3': led3State
});

/**En este metodo se hace la conexion con la placa arduino
 * Registrar evento de base de fuego.
 **/

board.on("ready", function () {

    led1 = new five.Led(4);
    led2 = new five.Led(13);
    led3 = new five.Led(2);

    led1.stop().off();
    led2.stop().off();
    led3.stop().off();
    listenEvent(); //se ejecuta el metedo listenEvent
});

//funcion para cambiar los estados de los leds en firabase ya sea de 0 a 1 o viceversa
var listenEvent = function () {
    dbRefLed1.on('value', function (snapshot) {
        changeLed(led1,snapshot.val(),'led1');
    });

    dbRefLed2.on('value', function (snapshot) {
        changeLed(led2,snapshot.val(),'led2');
    });

    dbRefLed3.on('value', function (snapshot) {
        changeLed(led3,snapshot.val(),'led3');
    });
};

/** En esta funcion imprimimos los estados de los led en consola
 * el parametro  led: es para saber que led hacido apadago oh prendido
 * el parametro  value: es para saber su estado actual 0 o 1
 * el parametro  tag: etiqueta que cambia de on a off dependiendo el estado del led
 **/
var changeLed = function(led, value, tag){
    switch (value){
        case 0:
            led.stop().on();
            console.log(tag + " off");
            break;
        default :
            led.off();
            console.log(tag + " on");
            break;
    }
};
