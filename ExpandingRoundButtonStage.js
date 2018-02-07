class ExpandingRoundButtonStage extends CanvasStage {
    constructor() {
        super()
        this.erb = new ERB()
        this.animator = new ERBAnimator()
    }
    render() {
        super.render()
        if(this.erb) {
            this.erb.draw(context)
        }
    }
    handleTap() {
        if(this.erb && this.animator) {
            this.erb.startUpdating(() => {
                this.animator.start(() => {
                    this.erb.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class ERBState {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scale += 0.1 * this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb(this.scale)
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1 - 2 * this.scale
            startcb()
        }
    }
}
class ERBAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            setInterval(() => {
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
class ERB {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.state = new ERBState()
    }
    draw(context) {
        const scale = this.state.scale
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        context.moveTo(-this.w/3*scale, -this.h/2)
        context.lineTo(this.w/3*scale, -this.h/2)
        context.lineTo(this.w/3*scale, this.h/2)
        context.lineTo(-this.w/3*scale, this.h/2)
        context.fill()
        context.beginPath()
        for(var i = 0;i<2;i++) {
            const px = (this.w/3) * (1-2*i)
            for(var j = 180*i,j <= 180*i+180;j++) {
                const x = px+this.h/2*Math.cos(j*Math.PI/180), y = this.h/2*Math.sin(j*Math.PI/180)
                if(j == 180*i) {
                    context.moveTo(x,y)
                }
                else {
                    context.lineTo(x,y)
                }
            }
            context.fill()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
const initERBStage = () => {
    const stage = new ExpandingRoundButtonStage()
    stage.render()
    stage.handleTap()
}
