class ParabolicPathStage extends CanvasStage{
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {

        }
    }
}
class ParabolicPath {
    constructor(x,y) {
        this.points = []
        this.px = x
        this.py = y
        this.x = 0
        this.y = 0
        this.state = new State()
    }
    draw(context,r) {
        context.save()
        context.translate(this.x,this.y)
        for(var i=0;i<2;i++) {
            context.save()
            context.scale(1-2*i,1)
            context.beginPath()
            context.arc(this.x,this.y,r,0,2*Math.PI)
            context.fill()
            context.restore()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(()=>{

        },stopcb)

    }
    startUpdating(startcb) {
        this.state.update(stopcb)
    }
}
class ParabolicState {
    constructor() {
        this.x = 0
        this.y = 0
        this.dir = 0
    }
    update(updatecb,stopcb) {
        this.x+=dir
        this.y = this.x*this.x
        if(this.x >= 10) {
            this.dir = -1
        }
        if(this.x < = 0) {
            this.dir = 0
            stopcb()
        }
        updatecb(this.x,this.y)
    }
    startUpdating() {
        if(this.dir == 0) {
            this.dir = 1
        }
    }
}
class Point {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
    equals(x,y) {
        return (this.x == x && this.y == y)
    }
}
