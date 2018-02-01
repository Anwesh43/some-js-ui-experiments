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
            if(i > 240 && i < 300) {
                r -= (r*Math.sin((i-90)*Math.PI/180)*this.state.scale)
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
    startUpdating(startcb,x,y) {
        const ball = new ElasticBall(x,y)
        ball.startUpdating(()=>{
            if(this.balls.size == 0) {
                startcb()
            }
            this.balls.push(ball)
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
