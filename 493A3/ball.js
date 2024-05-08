// Ball class definition (assuming you have a separate Ball class)
// Ball class created by Google Gemini and adapted by me
// Code also adapted from https://editor.p5js.org/jonfroehlich/sketches/04sI6mCwQ
class Ball {
    constructor(x, y, xSpeed, ySpeed, diameter) {
      this.x = x;
      this.y = y;
      this.xSpeed = xSpeed;
      this.ySpeed = ySpeed;
      this.diameter = diameter; // Ball diameter (optional, can be set here)
      this.fillColor = function(color) {
        // Assuming you have a fillColor method in your Ball class
        this.fill = color;
      };
    }
  
    update() {
      // Update the ball's position based on its speed
      this.x += this.xSpeed;
      this.y += this.ySpeed;
  
      // Check for bouncing at edges
      let radius = this.diameter / 2;
      if (this.x - radius < 0 || this.x + radius > width) {
        this.xSpeed *= -1; // Reverse x direction
      }
  
      if (this.y - radius < 0 || this.y + radius > height) {
        this.ySpeed *= -1; // Reverse y direction
      }
    }
  
    draw() {
      fill(this.fill);
      noStroke();
      ellipse(this.x, this.y, this.diameter);
    }
  }
  