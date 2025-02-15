function level2Setup() {
    posX = 25;
    posY = window.innerHeight/1.025/2;
    particle = new Particle();
    codingWindowLocked = false;
    checkPoints = []
    isAlive = true;
    score = 0;
    winningConditionMet = false;

    let n = 20;
    let x = 100;

    for(let i = 0; i < n; i++) {
        walls[i] =  generateBoundary((sceneW*3)-(n-i)*x);
    }

    // Canvas Borders
    
    checkPoints[0] = borders[borders.length - 1]
}

function level2Design() {
    checkPoints[0].show("#33FFBD")

    if (keyIsDown(UP_ARROW) || keyIsDown("W".charCodeAt(0))){
        if (posY > 13)
        posY -= playerSpeed;
    } 

    if (keyIsDown(DOWN_ARROW) || keyIsDown("S".charCodeAt(0))){
        if (posY < window.innerHeight/1.025 - 13)
            posY += playerSpeed;
    }

    if (keyIsDown(LEFT_ARROW) || keyIsDown("A".charCodeAt(0))){
        if (posX > 13)
            posX -= playerSpeed;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown("D".charCodeAt(0))){
        if (posX < sceneW - 13)
            posX += playerSpeed;
    }

    particle.update( posX, clamp(posY) )
    // if (posX < sceneW - 13)
    //         posX += 1;
    particle.show()
    let check = particle.look(walls,borders,checkPoints)
    if(check) {
        score+=check-1;
        if(score==1){
            return true;
        }
        let toPop;
        for(let i=0; i<walls.length; i++) {
            wall = walls[i]
            wall.a.x -= obstacleMovingSpeed
            wall.b.x -= obstacleMovingSpeed
            // checkPoints[i].a.x = wall.a.x
            // if (wall.a.x < 0){
            // }
            // walls[i].show("#FF5733");
            // checkPoints[i].show()
        }
        if(toPop)
            walls.pop(toPop)
    } 
    else {
        // obstacleMovingSpeed = 0; 
        isAlive = false;
    }
}

function level2CodeWindow(codeWindow) {
    textFont(GameOverSubText_font);
    textSize(fontsize);
    textAlign(LEFT);
    let wall_lengths = [];
    for(let i=0; i<walls.length; i++){
        if(walls[i].a.x < 0)
            continue
        wall_lengths.push(int(p5.Vector.dist(walls[i].a, walls[i].b)));
    }
    let msg = "Walls = [" + wall_lengths + "]";
    text(msg, codeWindow.x, codeWindow.y);
}

levels.push([level2Setup, level2Design, level2CodeWindow]);