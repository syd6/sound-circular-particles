
let serial;          // variable to hold an instance of the serialport library
var portName = '/dev/tty.usbserial-14310';  // fill in your serial port name here
var inData;                             // for incoming serial data

var inByte = 20; // this is problematic

//colors
var re = 255;
var bl = 255;
var gr = 255;

//bounds of sound sensitivity
var sound1 = 10;
var sound2 = 400;

var constant = 400;
var angle = 0.05;
var scalar = 150;
var speed;


class Soundbite {
  constructor() {
    this.x;
    this.y;
    //size
    this.size;
  }
  
  display() {
    ellipse(this.x, this.y, this.size); //circle() is not defined https://github.com/processing/p5.js/issues/3512
  }

  sizeChange(data) {
    this.size = data;
  }

  move(data) {
    //position 
    this.x = constant + sin(angle) * scalar;
    this.y = constant + cos(angle) * scalar;
    speed = map(data, sound1, sound2, 3, 50);
    angle += speed * 100;
  }
}


// list to store soundbite objects in
var particles = [];


function setup() {
  /***** SERIAL CONNECTION STUFF ****/
  createCanvas(windowWidth, windowHeight);
  serial = new p5.SerialPort();
  serial.list();
  serial.open('/dev/tty.usbserial-14310');
  serial.on('data', gotData);
  console.log("I've been created");
  /**** ACTUAL CODE ***/
  for (var x = 0; x < 2; x++) {
    particles.push(new Soundbite(20,20,30));
  }
  console.log(particles)
}

function draw() {
  for (var x = 0; x < particles.length; x++) {
    noStroke();
    fill(re, gr, bl);
    particles[x].display();
    particles[x].sizeChange(inByte);
    particles[x].move(inByte);
  }
  fill(0, 0, 0, 20);
  rect(0, 0, width, height);
}

function gotData() {
    //supposedly get the data 
    let currentString = serial.readLine();
    trim(currentString); 
    console.log(currentString);
    let currentNumber = Number(currentString);
    console.log("is this working")
    inByte = map(currentNumber, sound1, sound2, 0, height);

    //Map colors
    re = map(inByte, sound1, sound2, 128, 255); 
    gr = map(inByte, sound1, sound2, 215, 128);
    bl = map(inByte, sound1, sound2, 255, 175);

}

function serverConnected() {
    print("Connected to Server");
  }
  
  function gotList(thelist) {
    print("List of Serial Ports:");
  
    for (let i = 0; i < thelist.length; i++) {
      print(i + " " + thelist[i]);
    }
  }
  
  function gotOpen() {
    print("Serial Port is Open");
  }
  
  function gotClose() {
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
  }
  
  function gotError(theerror) {
    print(theerror);
  }


  /*
    serial.on('connected', serverConnected);
  serial.on('list', gotList);
  //serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose); */ //PRINT STATEMENTS ONLY