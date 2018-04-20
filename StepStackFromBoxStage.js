class StepStackFromBoxStage extends CanvasStage {

    constructor() {
        super()
        this.stepStack = new StepStack()
        this.animator = new StepStackAnimator()
    }

    render() {
        super.render()
        if (this.stepStack) {
            this.stepStack.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {

        this.canvas.onmousedown = (event) => {
            this.stepStack.startUpdating(() => {
                if (this.animator) {
                    this.animator.start(() => {
                        this.render()
                        this.stepStack.update(() => {
                            this.animator.stop()
                        })
                    })
                }
            })
        }
    }
}

class StepStackState {
    constructor() {
        this.scales = [0, 0, 0]
        this.j = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if (Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if (this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = 0
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class StepStack {
    constructor() {
        this.state = new StepStackState()
    }
    draw(context, w, h) {
        context.fillStyle = '#f39c12'
        const size = Math.min(w, h)/10
        context.save()
        context.translate(w/2, h/2)
        for (var i = 0; i < 2; i++) {
            context.save()
            context.scale(1 - 2 * i, 1 - 2 * i)
            for(var j = 0; j < 3; j++) {
                context.save()
                context.translate(-size/2 + (j + 1) * size * this.state.scales[2], -size/4 + (j + 1) * (size/2) * this.state.scales[1])
                context.fillRect(0, 0, size * this.state.scales[0], size/2 * this.state.scales[0])
                context.restore()
            }
            context.fillRect(-size/2, -size/4, size * this.state.scales[0], size/2 * this.state.scales[0])
            context.restore()
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

class StepStackAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
const initStepStackStage = () => {
    const stepStackStage = new StepStackFromBoxStage()
    stepStackStage.render()
    stepStackStage.handleTap()
}
