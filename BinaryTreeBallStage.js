const LEVELS = 5
class BinaryTreeBallStage extends CanvasStage {

    constructor() {
        super()
        this.binaryTreeBall = new BinaryTreeBall()
        this.animator = new BTBAnimator()
    }

    render() {
        super.render()
        if (this.binaryTreeBall) {
            this.binaryTreeBall.draw(this.context, this.size.w, this.size.h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.binaryTreeBall.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.binaryTreeBall.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
    }
}

class BTBState {

    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }

    update(stopcb) {
        this.scale += this.dir * 0.1
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }

    startUpdating(startcb) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}

class BTBAnimator {

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

class BTBNode {

    constructor(i, x, y, gapW, gapH) {
        this.x = x
        this.y = y
        this.i = i
        this.addChildren(gapW, gapH)
    }
    addParent(parent) {
        this.parent = parent
        this.state = new BTBState()
    }
    addChildren(gapW, gapH) {
        if (this.i < LEVELS -1) {
            const left = new BTBNode(this.i+1, this.x - gapW, this.y + gapH, gapW, gapH)
            const right = new BTBNode(this.i+1, this.x + gapW, this.y + gapH, gapW, gapH)
            left.addParent(this)
            right.addParent(this)
            this.left = left
            this.right = right
        }
    }

    draw(context, r) {
        var x = this.x, y = this.y
        if (this.parent) {
            x = this.parent.x + (this.x - this.parent.x) * this.state.scale
            y = this.parent.y + (this.y - this.parent.y) * this.state.scale
        }
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    update(stopcb) {
        this.state.update(stopcb)
    }

    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}

class BinaryTreeBall {
    constructor() {
        this.dir = 1
        this.currs = []
    }

    draw(context, w, h) {
        const r = Math.min(w, h)/25
        if (!this.started) {
            const x = w/2, y = r/2
            this.started = true
            this.currs.push(new BTBNode(0, x, y, w/(Math.pow(2,LEVELS)), h/(LEVELS)))
        }
        context.fillStyle = '#e67e22'
        this.currs.forEach((curr) => {
            curr.draw(context, r)
        })
    }

    update(stopcb) {
        const n = this.currs.length
        for (var i = 0; i < n; i++) {
            const curr = this.currs[i]
            curr.update(() => {
                if (curr.left && curr.right && this.dir == 1) {
                    this.currs.push(curr.left)
                    this.currs.push(curr.right)
                    this.currs.splice(0, 1)
                    console.log(i)
                }
                else if (this.dir == -1 && this.parent) {
                    this.currs.push(this.parent)
                    this.currs.splice(0, 2)
                }
                else {
                    this.dir *= -1
                }
                if (i == n-1) {
                    console.log(i)
                    stopcb()
                }
            })
        }
    }

    startUpdating(startcb) {
        if (this.currs.length == 1) {
            const root = this.currs[0]
            if (root.left && root.right) {
                this.currs.push(root.left)
                this.currs.push(root.right)
                this.currs.splice(0, 1)
                console.log(this.currs)
            }
        }
        this.currs.forEach((curr, index) => {
            curr.startUpdating(() => {
                if (index == this.currs.length - 1) {
                    startcb()
                }
            })
        })
    }
}

const initBinaryTreeBallStage = () => {
    const binaryTreeBallStage = new BinaryTreeBallStage()
    binaryTreeBallStage.render()
    binaryTreeBallStage.handleTap()
}
