// This is a web app that uses web serial to control the opacity of balls that move around the screen.
// It uses basic web serial template for p5.js using the Makeability Lab
// serial.js library:
// https://github.com/makeabilitylab/p5js/blob/master/_libraries/serial.js
//
// See a basic example of how to use the library here:
// https://editor.p5js.org/jonfroehlich/sketches/5Knw4tN1d
//
// For more information, see:
// https://makeabilitylab.github.io/physcomp/communication/p5js-serial
// 
// By Jon E. Froehlich
// @jonfroehlich
// http://makeabilitylab.io/

let pHtmlMsg;
let serialOptions = { baudRate: 115200 };
let serial;
let ballOpacity = 0; 
let xCurrentPos = 0; 
let balls = [];
let img; 
let backgrounds = []; 
let currentBackgroundIndex = 0;

// Code from https://github.com/makeabilitylab/p5js/blob/master/Sound/SoundLevelBubbles2-Image/ and adapted by me
function preload() {
    const backgroundsPaths = ['assets/denny.jpg', 'assets/fountain.jpg', 'assets/quad.jpg', 'assets/stadium.jpg'];
    for (const path of backgroundsPaths) {
        backgrounds.push(loadImage(path));
    }
}

function setup() {
  createCanvas(750, 450); // image sizes: 750 x 400

  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

  // If we have previously approved ports, attempt to connect with them
  serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);

  // Add in a lil <p> element to provide messages. This is optional
  pHtmlMsg = createP("Click anywhere on this page to open the serial connection dialog");
  pHtmlMsg.style('color', 'deeppink');
}

// Code from https://github.com/makeabilitylab/p5js/blob/master/Sound/SoundLevelBubbles2-Image/ and adapted by me
function draw() {
    img = backgrounds[currentBackgroundIndex]; 
    background(img);

  // print all serial values 
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    const imgPixelColor = img.get(balls[i].x, balls[i].y);
    balls[i].fillColor(color(red(imgPixelColor), green(imgPixelColor), blue(imgPixelColor), ballOpacity * 255));
    balls[i].draw();
  }
}

/**
 * Callback function by serial.js when there is an error on web serial
 * 
 * @param {} eventSender 
 */
 function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
  pHtmlMsg.html(error);
}

/**
 * Callback function by serial.js when web serial connection is opened
 * 
 * @param {} eventSender 
 */
function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened");
  pHtmlMsg.html("Serial connection opened successfully");
}

/**
 * Callback function by serial.js when web serial connection is closed
 * 
 * @param {} eventSender 
 */
function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
  pHtmlMsg.html("onSerialConnectionClosed");
}

/**
 * Callback function serial.js when new web serial data is received
 * 
 * @param {*} eventSender 
 * @param {String} newData new data received over serial
 */
function onSerialDataReceived(eventSender, newData) {
  console.log("onSerialDataReceived", newData);
  pHtmlMsg.html("onSerialDataReceived: " + newData);
  ballOpacity = parseFloat(newData);

  // make ball opacity printed value be whole numbers between 0 and 255 
  pHtmlMsg.html("Opacity: " + Math.floor(ballOpacity * 255));
}

/**
 * Called automatically by the browser through p5.js when mouse clicked
 */
function mouseClicked() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }
}

/**
 * Called automatically by the browser through p5.js when mouse clicked 
 */
function mousePressed() {
    // Create a new ball object with random speed and position based on click
    let newBall = new Ball(mouseX, mouseY, random(1, 3), random(1, 2), random(20, 40));
    balls.push(newBall); // Add the new ball to the balls array
}

/**
 * Called automatically by the browser through p5.js when key is pressed
 */
function keyPressed() {
    if(key == ' '){
      // reset balls 
        balls = [];
        // go to next background
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    }
}
