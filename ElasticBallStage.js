class ElasticBallStage extends CanvasStage {
    constructor() {
        super()
        this.container = new ElasticBallContainer()
        this.animator = new ElasticBallAnimator()
    }
    render() {
        super.render()
        if(this.container) {
            this.container.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const r = this.size.getMin()/10
            const x = event.offsetX, y = event.offsetY
            this.container.startUpdating(() => {
                this.animator.start(()=>{
                    this.render()
                    this.container.update(() => {
                        this.animator.stop()
                        this.render()
                    })
                })
            },x,y,r)
        }
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
class ElasticBall {
    constructor(x,y,r) {
        this.x = x
        this.y = y
        this.r = r
        this.state = new ElasticBallState()
    }
    draw(context) {
        context.fillStyle = 'cyan'
        context.save()
        context.translate(this.x,this.y)
        context.beginPath()
        for(var i=0;i<360;i++) {
            var r = this.r
            if(i > 180) {
                r -= ((0.62*this.r)*Math.abs(Math.sin((i)*Math.PI/180))*this.state.scale)
            }
            const x = r*Math.cos(i*Math.PI/180), y = r*Math.sin(i*Math.PI/180)
            if(i == 0) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
        }
        context.fill()
        context.restore()
    }
    update(startcb) {
        this.state.update(startcb)
    }
    startUpdating(stopcb) {
        this.state.startUpdating(stopcb)
    }
}
class ElasticBallContainer {
    constructor() {
        this.balls = []
    }
    draw(context) {
        this.balls.forEach((ball)=> {
            ball.draw(context)
        })
    }
    update(stopcb) {
        this.balls.forEach((ball,index) => {
            ball.update(()=>{
                this.balls.splice(index,1)
                if(this.balls.length == 0) {
                    stopcb()
                }
            })
        })
    }
    startUpdating(startcb,x,y,r) {
        const ball = new ElasticBall(x,y,r)
        this.balls.push(ball)
        ball.startUpdating(()=>{
            if(this.balls.length == 1) {
                startcb()
            }
        })
    }
}
class ElasticBallAnimator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
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
const initElasticBallStage = () => {
    const elasticBallStage = new ElasticBallStage()
    elasticBallStage.render()
    elasticBallStage.handleTap()
}
