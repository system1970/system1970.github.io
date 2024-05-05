let posX = 25;
let posY = window.innerHeight/1.025/2;

let walls = [];
let borders = [];
let checkPoints;
let ray;
let particle;

let xoffset = 0;
let yoffset = 100000;

let obstacleMovingSpeed = 3;
let playerSpeed = 15;

let isAlive;
let score;
let isResetting;

let winningConditionMet = false;
let level = 4;
let levels = []
let transitionTime = 1000; // 1000ms = 1s

let sceneW = window.innerWidth/1.5;
let sceneH = fullHeight = window.innerHeight/1.025;
let fullWidth = window.innerWidth/1.0125;

let codingWindow;
let codingWindowLocked = true;

let font;
let fontsize = 32;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  GameOver_font = loadFont('assets/fonts/Truculenta_18pt_Condensed-Bold.ttf');
  GameOverSubText_font = loadFont('assets/fonts/Truculenta_18pt_Condensed-ExtraLight.ttf')
}

function generateBoundary(start = sceneW/3, rand = true) {
    let upOrDown;
    if (rand)
        upOrDown = random(0, 100);
    else{
        upOrDown = 69;
    }
    let length = random(100, sceneH-200);
    if (upOrDown < 50)
        return new Boundary(start, 0, start, length)
    return new Boundary(start, sceneH - length, start, sceneH)
}

function keyPressed() {
    if(key==' '){
        if (!isAlive){
            isAlive = true;
            posX = 25;
            posY = window.innerHeight/1.025/2;
            setup()
        }
    }
}

function setup() {
    if (!codingWindow)
        codingWindow = new codeWindow(sceneW, 0, fullWidth, fullHeight);
    isResetting = false;
    createCanvas(window.innerWidth/1.0125, window.innerHeight/1.025);
    // borders.push(new Boundary(0, 0, sceneW, 0))
    // borders.push(new Boundary(0, height, sceneW, height))
    // borders.push(new Boundary(0, 0, 0, height))
    borders.push(new Boundary(sceneW, 0, sceneW, height))
    levels[level-1][0]();
}
  
function draw() {

    background(0);

    if (codingWindowLocked) {
        drawLocked();
    } else {
        codingWindow.show();
    }

    for(let i=0; i< borders.length; i++) {
        borders[i].show();
    }

    if(isAlive){
        if(winningConditionMet){
            gameTransition();
            if(!isResetting){
                isResetting = true;
                resetter();
            }
            // setup();
        } else {
            winningConditionMet = levels[level-1][1]();
        }
    } else {
        gameOver();
    }
}