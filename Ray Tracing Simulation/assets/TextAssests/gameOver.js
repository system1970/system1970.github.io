function gameOver() {
    textFont(GameOver_font);
    textSize(fontsize);
    textAlign(CENTER);

    let gap = 22;
    // let margin = 10;
    // let msg = "Game Over!";
    // // for(let i = 0; i<msg.length; i++) {
    //     text(msg, sceneW/2, sceneH/2)
    // // }
    let msg = "Game Over!";
    for(let i = 0; i<msg.length; i++) {
        text(msg[i], sceneW/2 - (gap * msg.length)/2.25 + gap * i, sceneH/2)
    }

    textFont(GameOverSubText_font);
    textSize(12);
    textAlign(CENTER);

    gap = 5;
    // let margin = 10;
    msg = "Press SPACE to retry.";
    for(let i = 0; i<msg.length; i++) {
        text(msg[i], sceneW/2 - (gap * msg.length + 20)/2 + gap * i, sceneH/2 + 50)
        // text(msg, sceneW/2 , sceneH/2 + 50)
    }
    // translate(margin * 4, margin * 4)
}