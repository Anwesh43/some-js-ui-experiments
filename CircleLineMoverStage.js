class CircleLineMoverStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX
        }
    }
}
class CircleLineAnimator {
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
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
