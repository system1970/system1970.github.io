class Boundary {
    constructor(x1, y1, x2, y2) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
    }

    show(color=null) {
        // console.log(color);
        if(color)
            stroke(color);
        else
            stroke(255)
        line(this.a.x, this.a.y, this.b.x, this.b.y);
        stroke(255)
    }
}