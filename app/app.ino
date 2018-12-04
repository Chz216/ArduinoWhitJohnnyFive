#include <SPI.h> //Aqui incluimos la libreria SPI
#include <Ethernet.h> //Aqui incluimos la libreria Ethernet

byte mac[]={0xDE,0xAD,0xBE,0xEF,0xFE,0xED}; //Declaracion de la direccion MAC 

IPAddress ip(192,168,0,95); //Declaracion de la IP 

EthernetServer servidor(3000); //Declaracion del puerto 80

int PIN_LED=13; //Aqui establecemos la variable PIN_LED como un valor entero

String readString=String(30); //lee los caracteres de una secuencia en una cadena.
//Los strings se representan como arrays de caracteres (tipo char)
String state=String(3);


void setup() {
  Ethernet.begin(mac, ip); //Inicializamos con las direcciones asignadas 
  servidor.begin(); //inicia el servidor
  pinMode(PIN_LED,OUTPUT);
  digitalWrite(PIN_LED,LOW);
  state="OFF";
}


void loop() {
  //EthernetClient Crea un cliente que se puede conectar a 
  //una dirección específica de Internet IP
  EthernetClient cliente= servidor.available(); 
  if(cliente) {
    boolean lineaenblanco=true; 
    while(cliente.connected()) {
      if(cliente.available()) {
        char c=cliente.read(); 
        if(readString.length()<30) {
          readString.concat(c);
          //Cliente conectado
          //Leemos petición HTTP caracter a caracter
          //Almacenar los caracteres en la variable readString
        } 
        if(c=='\n' && lineaenblanco) //Si la petición HTTP ha finalizado 
          {
          int LED = readString.indexOf("LED="); 
          if(readString.substring(LED,LED+5)=="LED=T") {
              digitalWrite(PIN_LED,HIGH);
              state="ON"; }
          else if (readString.substring(LED,LED+5)=="LED=F") {
              digitalWrite(PIN_LED,LOW); 
              state="OFF";
          }
          readString="";
        }
      }
    }
  }
}
