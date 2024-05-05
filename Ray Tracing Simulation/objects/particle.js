class Particle {
    constructor() {
        this.pos = createVector(width / 2, height / 2);
        this.rays = [];
        for (let i = 0; i < 360; i+=3){
            this.rays.push(new Ray(this.pos, radians(i)));
        }
        this.seen = {}
    }

    update(x, y) {
        this.pos.set(x, y);
    }

    look(walls, borders, checkPoints) {

        function keyIt(boundary){
            return " " + boundary.a.x + boundary.a.y + boundary.b.x + boundary.b.y 
        }

        for( let ray of this.rays) {
            let closest = null;
            let record = Infinity;
            for( let wall of walls ) {
                const point = ray.cast(wall);
                if (point) {
                    const d = p5.Vector.dist(this.pos, point);
                    if(d < record) {
                        record = d;
                        closest = point
                    }
                    if(d<=10){
                        console.log("DEAD.")
                        return 0;
                    }
                }
            }
            for( let border of borders ) {
                const point = ray.cast(border);
                if (point) {
                    const d = p5.Vector.dist(this.pos, point);
                    if(d < record) {
                        record = d;
                        closest = point
                    }
                }
            }
            if(mouseIsPressed){
                if(closest) {
                    stroke(255, 50)
                    line(this.pos.x, this.pos.y, closest.x, closest.y)
                }
            }
            for( let checkpoint of checkPoints ) {
                const point = ray.cast(checkpoint);
                if (point) {
                    const d = p5.Vector.dist(this.pos, point);
                    if(d < record) {
                        record = d;
                        closest = point
                    }
                    // console.log(d)
                    if(d<=15){
                        
                        if (keyIt(checkpoint) in this.seen) {
                            continue
                        } 
                        console.log(score)
                        this.seen[keyIt(checkpoint)] = true;
                        return 2;
                    }
                }
            }
            
            // return true;
        }

        return 1;
    } 

    show() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, 4);
        for(let ray of this.rays) {
            ray.show();
        }
    }
}