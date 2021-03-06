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
        this.lineTracker = new LineTracker(this.point)
    }
    draw(context) {
        context.save()
        context.translate(this.point.x,this.point.y)
        context.fillStyle = 'yellowgreen'
        context.beginPath()
        context.arc(0,0,size/2,0,2*Math.PI)
        context.fill()
        context.restore()
        this.lineTracker.draw(context)
    }
    update(stopcb) {
        if(this.destX && this.destY) {
            this.state.update(stopcb,(scale)=>{
                this.point.moveToPoint(this.destX,this.destY,scale)
                this.lineTracker.updateOnMove(this.point)
            },(scale)=>{
                this.lineTracker.updateOnEnd(1-scale)
            })
        }
    }
    startUpdating(x,y) {
        this.state.startUpdating()
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
    update(stopcb,updatecb_pos,updatecb_neg) {
        this.scale += this.dir*0.1
        if(this.dir == 1) {
            updatecb_pos(this.scale)
        }
        else {
            updatecb_neg(this.scale)
        }
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale+this.dir
            this.prevScale = this.scale
            this.dir*=-1
            if(this.scale == 0) {
                stopcb()
                this.dir = 0
            }
        }
    }
    startUpdating() {
        if(this.dir == 0) {
            this.dir = 1-2*this.scale
        }
    }
}
class LineTracker {
    constructor(point) {
        this.s = new Point(point.x,point.y)
        this.e = new Point(point.x,point.y)
    }
    draw(context) {
        context.lineCap = 'round'
        context.strokeStyle = 'yellowgreen'
        context.lineWidth = size/5
        context.beginPath()
        context.moveTo(this.s.x,this.s.y)
        context.lineTo(this.e.x,this.e.y)
        context.stroke()
    }
    updateOnEnd(scale) {
        this.s.moveToPoint(this.e.x,this.e.y,scale)
    }
    updateOnMove(p) {
        this.e = p
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    startAnimating(updatecb,startcb) {
        if(!this.animated) {
            this.animated = true
            startcb()
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class Stage {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
        this.mover = new Mover()
        this.animator = new Animator()
    }
    render() {
        this.context.fillStyle = '#212121'
        this.context.fillRect(0,0,w,h)
        this.mover.draw(this.context)
        this.mover.update(()=>{
            this.animator.stop()
        })
    }
    handleTap() {
        this.canvas.onclick = (event) => {
            const x = event.offsetX,y = event.offsetY

            this.animator.startAnimating(()=>{
                this.render()
            },()=>{
                  this.mover.startUpdating(x,y)
            })
        }
    }
}
function initMover() {
    const stage = new Stage()
    stage.render()
    stage.handleTap()
}
