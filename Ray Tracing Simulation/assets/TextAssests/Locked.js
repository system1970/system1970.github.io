function drawLocked(){
    fill(40, 120)
    rect(sceneW, 0, fullWidth, sceneH)

    textFont(GameOver_font);
    textSize(fontsize);
    textAlign(CENTER);

    let gap = 16;
    let msg = "LOCKED";
    let tempX = (fullWidth + sceneW)/2 - (gap * msg.length)/2.25;let tempY = sceneH/2;
    let boxX = tempX - 12 - 10; let boxY = tempY - 32 - 10;
    let boxWidth = boxX - tempX + 20; let boxHeight = boxY - tempY + 40;
    fill(0, 255)
    rect(boxX, boxY, gap*msg.length + boxWidth + 28, fontsize + boxHeight + 28)
    boxX+=10; boxY+=10;
    boxWidth = boxX - tempX + 20;boxHeight = boxY - tempY + 40 ;
    fill(0, 255)
    rect(boxX, boxY, gap*msg.length + 8, fontsize + 8)
    
    for(let i = 0; i<msg.length; i++) {
        text(msg[i], tempX + gap * i, tempY)
    }
}