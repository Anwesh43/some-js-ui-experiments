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
        this.state = new State()
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
        if(this.destX && this.destY) {
            this.state.update(stopcb)
            this.point.moveToPoint(this.destX,this.destY,this.state.scale)
        }
    }
    startUpdating(startcb,x,y) {
        this.state.startUpdating(startcb)
        this.destX = x
        this.destY = y
    }
}
class State {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb,updatecb) {
        this.scale += this.dir*0.1
        updatecb(this.scale)
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.dir = 0
            this.scale = this.prevScale+this.dir
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1-2*this.scale
        }
    }
}
