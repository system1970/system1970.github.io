var inc = 0.1;
var incStart = 0.005;
var magInc = 0.0005;
var start = 0;
var scl = 50;
var cols, rows;
var zoff = 0;
var fps;
var particles = [];
var numParticles = 1000;
var flowfield;
var flowcolorfield;
var magOff = 0;
var attractionPoints = [];
// var showField = true;
var showField = false;
var flowfield;

function level4Setup() {
  posX = 25;
  codingWindowLocked = false;
  posY = window.innerHeight/1.025/2;
  particle = new Particle();
  pixelDensity(1);
  cols = floor(sceneW / scl);
  rows = floor(height / scl);
  // col = 100;
  // rows = 100;
  background(0);

  for (let i = 0; i < numParticles; i++) {
    particles[i] = new flowFieldParticle(6);
  }

  flowfield = new Array(rows * cols);
  flowcolorfield = new Array(rows * cols);
}

function flowFieldParticle(maxSpeed) {
  this.pos = createVector(random(100, sceneW), random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxSpeed = maxSpeed;

  this.prevPos = this.pos.copy();

  this.update = function () {
    let attraction = createVector(particle.pos.x, particle.pos.y).sub(this.pos);
    let distance = attraction.mag();
    distance = constrain(distance, 5, 25);
    let multi = 10;
    if(mouseIsPressed) {
      multi*=-10;
    }
    let strength = (1 / distance) * multi;
    attraction.setMag(strength);
    this.applyForce(attraction);

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.applyForce = function (force) {
    this.acc.add(force);
  };

  this.show = function (colorfield) {
    // strokeWeight(0.1);
    // if (mouseIsPressed) line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    strokeWeight(1);
    this.updatePrev();
    //point(this.pos.x, this.pos.y);
  };

  this.inverseConstrain = function (pos, key, f, t) {
    if (pos[key] < f) {
      pos[key] = t;
      this.updatePrev();
    }
    if (pos[key] > t) {
      pos[key] = f;
      this.updatePrev();
    }
  };

  this.updatePrev = function () {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  };

  this.edges = function () {
    this.inverseConstrain(this.pos, "x", 0, sceneW);
    this.inverseConstrain(this.pos, "y", 0, sceneH);
  };

  this.follow = function (vectors, colorfield) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
    let c = colorfield[index];
    if (c) {
      stroke(color(c[0], c[1], c[2]));
    }
  };
}

function level4Design() {

  if (keyIsDown(UP_ARROW) || keyIsDown("W".charCodeAt(0))) {
    if (posY > 13) posY -= playerSpeed;
  }

  if (keyIsDown(DOWN_ARROW) || keyIsDown("S".charCodeAt(0))) {
    if (posY < window.innerHeight / 1.025 - 13) posY += playerSpeed;
  }

  if (keyIsDown(LEFT_ARROW) || keyIsDown("A".charCodeAt(0))) {
    if (posX > 13) posX -= playerSpeed;
  }

  if (keyIsDown(RIGHT_ARROW) || keyIsDown("D".charCodeAt(0))) {
    if (posX < sceneW - 13) posX += playerSpeed;
  }

  particle.update(posX, clamp(posY));
  // if (posX < sceneW - 13)
  //         posX += 1;
  particle.show();
  if (showField) {
    background(0);
  } else {
    background(color(0, 0, 0, 5));
  }
  var yoff = start;
  for (let y = 0; y < rows; y++) {
    let xoff = start;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let r = noise(xoff, yoff, zoff) * 255;
      let g = noise(xoff + 100, yoff + 100, zoff) * 255;
      let b = noise(xoff + 200, yoff + 200, zoff) * 255;
      let angle = noise(xoff, yoff, zoff) * 90;
      let v = p5.Vector.fromAngle(angle); // vector from angle
      let m = map(noise(xoff, yoff, magOff), 0, 1, -5, 5);
      v.setMag(m);
      if (showField) {
        push();
        stroke(255);
        translate(x * scl, y * scl);
        rotate(v.heading());
        let endpoint = abs(m) * scl;
        line(0, 0, endpoint, 0);
        if (m < 0) {
          stroke("red");
        } else {
          stroke("green");
        }
        line(endpoint - 2, 0, endpoint, 0);
        pop();
      }
      flowfield[index] = v;
      flowcolorfield[index] = [255, 255, 255, random(0, 1)];
      xoff += inc;
    }
    yoff += inc;
  }
  magOff += magInc;
  zoff += incStart;
  start -= magInc;

  if (!showField) {
    for (let i = 0; i < particles.length; i++) {
      
      if(p5.Vector.dist(particles[i].pos, particle.pos)<23) {
          // console.log(p5.Vector.dist(particles[i].pos, particle.pos))
          // isAlive = false;
          // return false;
      }
      particles[i].follow(flowfield, flowcolorfield);
      // if(mouseIsPressed)
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }

    // if (random(10) > 5 && particles.length < numParticles) {
    //   let rnd = floor(noise(zoff) * 20);
    //   for (let i = 0; i < rnd; i++) {
    //     particles.push(new flowFieldParticle());
    //   }
    // } else if (particles.length > 2000) {
    //   let rnd = floor(random(10));
    //   for (let i = 0; i < rnd; i++) {
    //     particles.shift();
    //   }
    // }
  }

  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];

    // Find the corresponding flow field vector for the particle's position
    let x = floor(constrain(particle.pos.x / scl, 0, cols - 1));
    let y = floor(constrain(particle.pos.y / scl, 0, rows - 1));
    let index = x + y * cols;
    let force = flowfield[index];
    particle.applyForce(force);

    // Update and display particles
    particle.update();
    particle.edges();
    particle.show();
  }
}

function level4CodeWindow(codeWindow) {
  textFont(GameOverSubText_font);
  textSize(fontsize);
  textAlign(LEFT);
  let wall_lengths = [];
  for (let i = 0; i < walls.length; i++) {
    if (walls[i].a.x < 0) continue;
    wall_lengths.push(int(p5.Vector.dist(walls[i].a, walls[i].b)));
  }
  let msg = "Walls = [" + wall_lengths + "]";
  text(msg, codeWindow.x, codeWindow.y);
}

levels.push([level4Setup, level4Design, level4CodeWindow]);
