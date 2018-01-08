const w = window.innerWidth, h = window.innerHeight,size = Math.min(w,h)/20
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
class Mover {
    constructor() {
        this.point = new Point(w/2,h/2)
    }
    draw(context) {
        context.save()
        context.translate(this.point.x,this.point.y)
        context.fillStyle = 'yellowgreen'
        context.beginPath()
        context.arc(0,0,size/2,0,2*Math.PI)
        context.fill()
        context.restore()
    }
    update(stopcb) {

    }
    startUpdating(startcb) {

    }
}
