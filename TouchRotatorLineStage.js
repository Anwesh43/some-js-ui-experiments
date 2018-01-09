class TouchRotatorLine {
    constructor(x,y,w) {
        this.x = x
        this.y = y
        this.w = w
        this.deg = 0
        this.state = new RotatorLineState()
    }
    draw(context) {
        context.save()
        context.translate(this.x,this.y)
        context.rotate(this.deg*Math.PI/180)
        context.strokeStyle = 'yellowgreen'
        context.lineWidth = this.w/10
        context.lineCap = 'round'
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(this.w,0)
        context.stroke()
        context.restore()
    }
    startUpdating(deg,startcb) {
        this.state.startUpdating(()=>{
            this.destDeg = deg
            startcb()
        })
    }
    update(stopcb) {
        this.state.update(()=>{
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
        this.animator = new RotatorLineAnimator()
        this.rotator = new TouchRotatorLine(this.size.w/2,this.size.h/2,Math.min(this.size.w,this.size.h)/5)
        this.looper = new Looper()
    }
    render() {
        super.render()
        if(this.rotator) {
            this.rotator.draw(this.context)
            this.rotator.update(()=>{
                this.animator.stop()
            })
        }
    }
    handleTap() {
        this.isdown = false
        this.count = 0
        this.canvas.onmousedown = (event) => {
            if(!this.isdown) {
                this.isdown = true
                this.looper.start()
            }
        }
        this.canvas.onmouseup = (event) => {
            if(this.isdown) {
                this.isdown = false
                this.looper.stop((deg)=>{
                    this.rotator.startUpdating(deg,()=>{
                        this.animator.startAnimation(()=>{
                            this.render()
                        })
                    })
                })
            }
        }
    }
}
class RotatorLineState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += 0.1*this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir *= -1
            this.prevScale = this.scale
            if(this.prevScale == 0) {
                this.dir = 0
                stopcb()
            }
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
    stage.handleTap()
}
class RotatorLineAnimator {
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
              this.animated = false
              clearInterval(this.interval)
        }
    }
}
class Looper {
    constructor() {
        this.count = 0
    }
    start() {
        if(!this.interval) {
            console.log(this.count)
            this.interval = setInterval(()=>{
                console.log(this.count)
                if(this.count < 360 ) {
                    this.count+=5
                }
            },50)
        }
    }
    stop(cb) {
        if(this.interval) {
            cb(this.count)
            clearInterval(this.interval)
            this.interval = undefined
            this.count = 0
        }
    }
}
