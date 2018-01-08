class Point {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.prevX = x
        this.prevY = y
    }
    moveToPoint(x,y,scale) {
        this.x = this.prevX + (x-this.prevX)*scale
        this.y = this.prevY + (y-this.prevY)*scale
        if(scale >= 1) {
            this.x = x
            this.y = y
            this.prevX = x
            this.prevY = y
        }
    }
}
