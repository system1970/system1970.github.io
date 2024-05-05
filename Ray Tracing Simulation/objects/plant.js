class plant {
    constructor(plantX, maxGeneration, growthRate){
        this.drawRules = {
            "A": (t) => {
              // Draw circle at current location
              noStroke();
              fill("#E5CEDC");
              circle(0, 0, this.len*2 * t);
            },  
            "B": (t) => {
              // Draw circle at current location
              noStroke();
              fill("#FCA17D");
              circle(0, 0, this.len*2 * t);
            },
            "F": (t) => {
              // Draw line forward, then move to end of line
              stroke("#9ea93f");
              line(0, 0, 0, -this.len * t);
              translate(0, -this.len * t);
            },
            "+": (t) => {
              // Rotate right
              rotate(PI/180 * -this.ang * t);
            },
            "-": (t) => {
              // Rotate right
              rotate(PI/180 * this.ang * t);
            },
            // Save current location
            "[": push,
            // Restore last location
            "]": pop,
          };

        this.rules = {
            X: [
              // Original rule
              { rule: "(F[+X][-X]FX)",  prob: 0.5  },
              
              // Fewer limbs
              { rule: "(F[-X]FX)",      prob: 0.05 },
              { rule: "(F[+X]FX)",      prob: 0.05 },
              
              // Extra rotation
              { rule: "(F[++X][-X]FX)", prob: 0.1  },
              { rule: "(F[+X][--X]FX)", prob: 0.1  },
              
              // Berries/fruits
              { rule: "(F[+X][-X]FXA)",  prob: 0.1  },
              { rule: "(F[+X][-X]FXB)",  prob: 0.1  }
            ],
            F: [
              // Original rule
              { rule: "F(F)",  prob: 0.85 },
              
              // Extra growth
              { rule: "F(FF)", prob: 0.05 },
              
              // Stunted growth
              { rule: "F",   prob: 0.1 },
            ],
            "(": "",
            ")": ""
        };
        this.len = 4;
        this.ang = 25;
        
        this.word = "X";
        
        this.maxGeneration = maxGeneration;
        this.currGeneration = 0;
        
        this.plantX = plantX;
        
        this.growthPercent = 1;
        this.growthRate = growthRate;
            
    }
    

    show(){
        if(this.growthPercent < 1) {
            const mod = (this.currGeneration + this.growthPercent);
            this.growthPercent += this.growthRate/mod;
        } else {
            this.nextGeneration();
        }
        
        this.drawLsysLerp(this.plantX, sceneH, this.word, this.growthPercent);
    }
  
    nextGeneration() {
        if(this.growthPercent < 1) {
            return;
        }
        
        if(this.currGeneration < this.maxGeneration) {
            this.word = this.generate(this.word);
            this.currGeneration ++;
            this.growthPercent = 0;
            // currGeneration = 0;
            // word = "X";
        }
    }
  
    generate(word) {
        let next = ""
        
        for(let i = 0; i < word.length; i ++) {
            let c = word[i];
            if(c in this.rules) {
                let rule = this.rules[c];
                
                // Check if we're using an array or not
                if(Array.isArray(rule)) {
                next += this.chooseOne(rule); // If we are, choose one of the options
                } else {
                next += this.rules[c]; // Otherwise use the rule directly
                }
            } else {
                next += c;
            }
        }
        
        return next;
    }
  
    chooseOne(ruleSet) {
        let n = random(); // Random number between 0-1
        let t = 0;
        for(let i = 0; i < ruleSet.length; i++) {
            t += ruleSet[i].prob; // Keep adding the probability of the options to total
            if(t > n) { // If the total is more than the random value
                return ruleSet[i].rule; // Choose that option
        }
        }
        return "";
    }
  
    drawLsysLerp(x, y, state, t) {
        t = constrain(t, 0, 1);
        
        let lerpOn = false;
        
        push();
        translate(x, y);
        for(let i = 0; i < state.length; i ++) {
            let c = state[i];
            
            if(c === "(") {
                lerpOn = true;
                continue;
            }
            
            if(c === ")") {
                lerpOn = false;
                continue;
            }
            
            let lerpT = t;
            
            if(!lerpOn) {
                lerpT = 1;
            }
            
            if(c in this.drawRules) {
                this.drawRules[c](lerpT);
            }  
        }
        pop();
    }  
}