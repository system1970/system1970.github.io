function gameTransition() {
    textFont(GameOver_font);
    textSize(fontsize-10);
    textAlign(CENTER);

    let gap = 12;
    let msg = "Level {0} Completed!".format(level);
    for(let i = 0; i<msg.length; i++) {
        text(msg[i], sceneW/2 - (gap * msg.length)/2.25 + gap * i, sceneH/2)
    }
}

async function resetter(){
    await sleep(transitionTime);
    level++;
    winningConditionMet = false;
    setup();
}