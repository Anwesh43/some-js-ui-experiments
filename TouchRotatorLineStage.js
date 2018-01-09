class TouchRotatorLine {
    constructor(x,y,w) {
        this.x = x
        this.y = y
        this.w = w
        this.deg = 0
        this.state = new State()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        contexr.rotate(this.deg*Math.PI/180)
        context.strokeStyle = 'yellowgreen'
        context.lineWidth = this.w/30
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(this.w,0)
        context.stroke()
        context.restore()
    }
    startUpdating(deg,startcb) {
        state.startUpdating(()=>{
            this.destDeg = deg
            startcb()
        })
    }
    update(stopcb) {
        state.update(()=>{
            stopcb()
        })
        if(this.destDeg) {
            this.deg = this.destDeg*this.state.scale
        }
    }
}
class TouchRotatorLineStage extends CanvasStage{
    constructor() {
        super()
        this.animator = new Animator()
        this.rotator = new TouchRotatorLine(this.size.w/2,this.size.h/2,Math.min(this.size.w,this.size.h)/5)
    }
    render() {
        super.render()
        this.rotator.draw(context)
        this.rotator.update(()=>{
            this.animator.stop()
        })
    }
    handleTap() {
        this.isdown = false
        this.canvas.onmousedown = (event) => {
            if(!this.isdown) {
                this.isdown = false
            }
        }
        this.canvas.onmousemove = (event) => {
            if(this.isdown) {
                this.isdown = true
            }
        }
    }
}
class State {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += 0.1*this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
          if(this.dir == 0) {
              this.dir = 1-2*this.scale
              startcb()
          }
    }
}
const initTouchRotatorStage = () => {
    const stage = new TouchRotatorLineStage()
    stage.render()
}
class Animator {
    constructor() {
        this.animated = false
    }
    startAnimation(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                updatecb()
            },50)
        }
    }
    stop() {
        if(this.animated) {
              this.animated = true
              clearInterval(this.interval)
        }
    }
}
