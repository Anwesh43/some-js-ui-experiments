class ElasticBallStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
    }
}
class ElasticBallState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.deg = 0
    }
    update(stopcb) {
        this.deg += this.dir*Math.PI/20
        this.scale = Math.sin(this.deg)
        if(this.deg > Math.PI) {
            this.deg = 0
            this.scale = 0
            this.dir = 0
            stopcb()
        }
    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
