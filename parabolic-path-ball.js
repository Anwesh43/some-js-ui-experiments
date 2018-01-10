const n = 10,k = 10
class ParabolicPathStage extends CanvasStage{
    constructor() {
        super()
        this.animator = new ParabolicPathAnimator()
        this.parabolicPath = new ParabolicPath(this.size.w/2,this.size.h/2)
    }
    render() {
        super.render()
        if(this.parabolicPath) {
            this.parabolicPath.draw(this.context,Math.min(this.size.w,this.size.h)/20,this.size.h/2)
        }
    }
    onResize(w,h) {
        super.onResize(w,h)
        this.parabolicPath = new ParabolicPath(w/2,h/2)
        if(this.animator) {
            this.animator.stop()
        }
        this.animator = new ParabolicPathAnimator()
        this.render()
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            console.log("start")
            this.parabolicPath.startUpdating(()=>{
                this.animator.start(()=>{
                    this.render()
                    this.parabolicPath.update(()=>{
                        this.animator.stop()
                    })
                })
            })
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
        this.state = new ParabolicState()
    }
    draw(context,r,h) {
        context.save()
        context.translate(this.px,this.py)
        context.fillStyle = '#e74c3c'
        for(var i=0;i<2;i++) {
            context.save()
            context.scale(1-2*i,1)
            context.beginPath()
            context.arc(this.x,(this.y*(h/(n*n*k*k)))*-1,r,0,2*Math.PI)
            context.fill()
            context.lineWidth = r/10
            context.lineCap = 'round'
            context.strokeStyle = context.fillStyle
            context.beginPath()
            this.points.forEach((point,index)=>{
                if(index == 0) {
                    context.moveTo(point.x,point.mapY(-h,n*n*k*k))
                }
                else {
                    context.lineTo(point.x,point.mapY(-h,n*n*k*k))
                }
            })
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    checkAndReturnPointPresent(x,y) {
        for(var i=0;i<this.points.length;i++) {
            if(this.points[i].equals(x,y)) {
                return i
            }
        }
        return -1
    }
    update(stopcb) {
        this.state.update((x,y)=>{
            this.x = x
            this.y = y
            const index = this.checkAndReturnPointPresent(x,y)
            if(index == -1) {
                this.points.push(new ParabolicPoint(x,y))
            }
            else {
                this.points.splice(index,1)
            }
            console.log("moving")
        },stopcb)

    }
    startUpdating(startcb) {
        console.log("here")
        this.state.startUpdating(startcb)
    }
}
class ParabolicState {
    constructor() {
        this.x = 0
        this.y = 0
        this.dir = 0
    }
    update(updatecb,stopcb) {
        this.x+=this.dir*n
        this.y =  (this.x*this.x)

        if(this.x >= n*k) {
            this.dir = -1
            console.log(this.y)
        }
        if(this.x <= 0) {
            this.dir = 0
            stopcb()
        }
        updatecb(this.x,this.y)
    }
    startUpdating(startcb) {
        console.log("startcb")
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class ParabolicPoint {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
    equals(x,y) {
        return (Math.floor(this.x) == Math.floor(x) && Math.floor(this.y) == Math.floor(y))
    }
    mapY(h,maxY) {
        return this.y*(h/maxY)
    }
}
class ParabolicPathAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {

        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
            console.log("cloed the interval")
        }
    }
}
function initParabolicPathStage() {
    const stage = new ParabolicPathStage()
    stage.render()
    stage.handleTap()
}
