String.prototype.format = function() {
    let formatted = this;
    for (let i = 0; i < arguments.length; i++) {
        let regexp = new RegExp("\\{" + i + "\\}", "gi");
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function clamp(pos){
    if(pos < 8){
        return 8;
    } else if(pos > window.innerHeight/1.025){
        return window.innerHeight/1.025
    }
    return pos
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function removeElement(arrayName,arrayElement)
 {
    for(var i=0; i<arrayName.length;i++ )
     { 
        if(arrayName[i]==arrayElement)
            arrayName.splice(i,1); 
      } 
}

function randomWithProbability() {
    var notRandomNumbers = [0, 1, 1, 1, 1, 2, 2, 2, 3, 4];
    var idx = Math.floor(Math.random() * notRandomNumbers.length);
    return notRandomNumbers[idx];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}