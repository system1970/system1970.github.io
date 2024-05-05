class codeWindow {
    constructor(x,y,width,height){
        this.x = x + 10;
        this.y = y + fontsize;
        this.width = width;
        this.height = height;
        this.code = "";
    }

    show(){
        levels[level-1][2](this);
    }
}