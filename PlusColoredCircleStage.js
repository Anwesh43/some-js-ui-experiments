class PlusColoredCircleStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX, y = event.offsetY

        }
    }
}
class State {
    constructor() {
        this.scales = [0, 0]
        this.j = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir *= -1
                this.prevScale = this
                if(this.dir == 1) {
                    this.dir = 0
                    stopcb()
                }
            }
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class PlusColoredCircle {
    constructor(x, y) {
        this.state = new State()
        this.x = x
        this.y = y
    }
    drawPlus(context, size) {
        const scale1 = this.state.scales[0], scale2 = this.state.scales[1], updated_size = size * scale1
        context.save()
        context.rotate(Math.PI/4 * scale2)
        for(var i = 0; i < 2; i++) {
            context.save()
            context.rotate(i * Math.PI/2)
            context.beginPath()
            context.moveTo(0, -updated_size)
            context.lineTo(0, updated_size)
            context.stroke()
            context.restore()
        }
        context.restore()
    }
    drawArc(context, color, r, start, sweep) {
        context.strokeStyle = color
        context.save()
        context.rotate(start * Math.PI/180)
        context.beginPath()
        for(var i = 0; i <= sweep; i++) {
            const x = r * Math.cos(i * Math.PI/180), y = r * Math.sin(i * Math.PI/180)
            if(i == 0) {
                context.moveTo(x, y)
            }
            else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
        context.restore()
    }
    drawColoredCircle(context, r) {
        const colors = ["#3498db", "#9b59b6", "#1abc9c", "#e74c3c", "#27ae60", "#e67e22"]
        const deg = 360/colors.length
        colors.forEach((color, index) => {
            this.drawArc(context, color, r, index * deg, deg)
        })
    }
    draw(context, size) {
        context.save()
        context.tranlsate(this.x, this.y)
        this.drawPlus(context, size/3)
        this.drawColoredCircle(context, size/2)
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
