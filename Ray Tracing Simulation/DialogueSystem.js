class dialogueSystem {
    constructor(){
        this.spoken = {};
        this.narration = {};
    }

    speak(level, spec_di = null){
        if(spec_di){
            
        } else {
            levels[level-1][2](this)
        }
    }
}