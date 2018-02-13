class SquaredBarState extrends CanvasStage {
    constructor() {
        super()
        this.animator = new SBAnimator()
        this.sbl = new SquaredBarList(this.size.w,this.size.h)
    }
    render() {
        super.render()
        if(this.sbl) {
            this.sbl.draw(context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = () => {
            this.sbl.startUpdating(() => {
                this.animator.start(() => {
                    this.sbl.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}
class SBState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += this.dir * 0.1
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0)( {
            this.dir = 1 - 2*this.scale
            startcb()
        }
    }
}
class SBAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            },50)
        }
    }
    stop() {
        if(!this.animated) {
            this.animated = true
            clearInterval(this.interval)
        }
    }
}
class SquaredBarList {
    constructor(w,h) {
        this.state = new SquaredBarState()
        this.w = w
        this.h = h
    }
    draw(context) {
        const n = 10
        const x_gap = this.w/(n+2), y_gap = this.h/(2*n+1)
        var x = x_gap, y = y_gap
        context.save()
        context.translate(this.w/2,this.h/2)
        for(var i=0;i<n;i++) {
            context.beginPath()
            context.moveTo(0,y)
            context.lineTo(this.w*this.state.scale,y)
            context.stroke()
            context.beginPath()
            context.moveTo(x,0)
            context.lineTo(x,this.w*this.state.scale)
            context.stroke()
            x += x_gap
            y += y_gap
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
