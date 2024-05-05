let seedCount;
let plants;
let totalSeedsCollected;

function level3Setup() {
    plants = [];
    seedCount = 100;
    totalSeedsCollected = 0;
}

function mouseReleased() {
    let collected_plants = 0;
    if (plants){
        for(let i = 0; i < plants.length; i++){
            Plant = plants[i];
            console.log(Plant.growthPercent)
            if ((Plant.currGeneration == Plant.maxGeneration) && (Plant.growthPercent>1)){
                if(Plant.maxGeneration){
                    seedCount+=randomWithProbability();
                    plants[i] = 0;
                    collected_plants++;
                }
            }
            console.log(seedCount, Plant.maxGeneration);
        }
        removeElement(plants, 0);
    }
    
    if (collected_plants == 0){
        if(seedCount>0){
            plants.push(new plant(random(100, sceneW - 100), int(random(5,8)), random(0.08, 0.1)));
            seedCount--;
        };
    }
}

function level3Design() {
    for(let plant of plants){
        if (plant){
            plant.show();
        }
    }
    if(seedCount>101){
        return true;
    }
    return false;
}

function level3CodeWindow(codeWindow) {
    textFont(GameOverSubText_font);
    textSize(fontsize);
    textAlign(LEFT);
    let msg = `Seed Count: {0}`.format(seedCount)
    text(msg, codeWindow.x, codeWindow.y);
}

levels.push([level3Setup, level3Design, level3CodeWindow]);