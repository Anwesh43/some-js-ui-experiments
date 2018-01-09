class DimensionController {
    constructor() {
        this.w = window.innerWidth
        this.h = window.innerHeight
    }
    startResizing(update) {
        window.onresize = () => {
            this.w = window.innerWidth
            this.h = window.innerHeight
            update(this.w,this.h)
        }
    }
}
