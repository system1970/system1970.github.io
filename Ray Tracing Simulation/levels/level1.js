function level1Setup(){
    checkPoints = []
    isAlive = true;
    score = 0;
    winningConditionMet = false;
    // obstacleMovingSpeed = 3;

    for(let i = 0; i < 7; i++) {
        walls[i] =  generateBoundary(sceneW/3 + i*100);
    }

    // Canvas Borders
    
    checkPoints[0] = borders[borders.length - 1]
    // ray = new Ray(100, 200);
    particle = new Particle();
}

function level1Design(){
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

    // particle.update(noise(xoffset) * width, noise(yoffset) * height);
    particle.update( posX, clamp(posY) )
    particle.show();
    let check = particle.look(walls,borders,checkPoints)
    if(check) {
        score+=check-1;
        if(score==1){
            return true;
        }
        for(let i=0; i<walls.length; i++) {
            wall = walls[i]
            wall.a.x -= obstacleMovingSpeed
            wall.b.x -= obstacleMovingSpeed
            // checkPoints[i].a.x = wall.a.x
            if (wall.a.x < 0){
                walls[i] = generateBoundary(sceneW);
            }
            walls[i].show("#FF5733");
            // checkPoints[i].show()
        }
    } 
    else {
        // obstacleMovingSpeed = 0; 
        isAlive = false;
    }

    return false;
}

levels.push([level1Setup, level1Design]);