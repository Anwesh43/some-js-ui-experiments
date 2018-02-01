class CanvasStage {
    constructor() {
        this.dimensionController = new DimensionController()
        this.createCanvas()
        this.onResize(this.dimensionController.w,this.dimensionController.h)
        this.dimensionController.startResizing(this.onResize.bind(this))

    }
    createCanvas() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.dimensionController.w
        this.canvas.height = this.dimensionController.h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }
    onResize(w,h) {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        this.size = new Size(this.canvas.width,this.canvas.height)
        this.render()
    }
    getSize() {
        return this.size
    }
    render() {
        this.context.fillStyle = '#212121'
        this.context.fillRect(0,0,this.size.w,this.size.h)
    }
}
class Size {
    constructor(w,h) {
        this.w = w
        this.h = h
    }
    getMin() {
        return Math.min(this.w,this.h)
    }
}
