class NotificationStage extends CanvasStage {
    constructor() {
        super()
        this.notifContainer = new NotifUIContainer(2*this.size.w/3,this.size.h/30,this.size.w/3)
        this.animator = new NotifAnimator()
    }
    render() {
        super.render()
        if(this.notifContainer) {
            this.notifContainer.draw(this.context)
        }
    }
    handleTap() {
        this.canvas.onmousedown = (event) => {
            const x = event.offsetX,y = event.offsetY
            this.notifContainer.handleTap(x,y,()=>{
                this.render()
            })
        }
    }
    startAddingText() {
        const texts = ["Hello world im looking for something new.","Henrikh MKH is a gunner. Yeah bye bye Sanchez.","Lets go br br br. I am ecstatic.","The best way to understand what the Disruptor is, is to compare it to something well understood and quite similar in purpose. In the case of the Disruptor this would be Java's BlockingQueue.","WWE Raw, also known as Monday Night Raw or simply Raw, is a professional wrestling television program that currently airs live on Monday evenings at 8 pm EST on the USA Network in the United States","The Attitude Era was the best , but hatsoff to RAW , it is carrying on since 1993 and one of the longs running TV shows ever"]
        const interval = setInterval(()=>{
            this.notifContainer.addText(texts[0],()=>{
                this.animator.start(()=>{
                    this.render()
                    this.notifContainer.update(()=>{
                        this.animator.stop()
                    })
                })
            })
            texts.splice(0,1)
            if(texts.length == 0) {
                clearInterval(interval)
            }
        },2000)
    }
}
class NotificationText {
    constructor(x,y,w,text) {
        this.y = y
        this.x = x
        this.w = w
        this.text = text
        this.textParts = []
        this.state = new NotifUIState()
    }
    draw(context) {
        const x = this.x,w = this.w
        context.font = context.font.replace(/\d{2}/g,20)
        if(this.textParts.length == 0) {
            var msg = ""
            var words = this.text.split(" ")
            console.log(words)
            var y = 40
            for(var i=0;i<words.length;i++) {
                if(context.measureText(msg+" "+words[i]).width > 0.9*w) {
                    this.textParts.push(new TextPart(msg,y))
                    y += 40
                    msg = words[i]
                }
                else {
                    if(i == 0) {
                        msg = words[i]
                    }
                    else {
                        msg += " "+words[i]
                    }
                }
            }
            this.textParts.push(new TextPart(msg,y))
            y += 40
            this.h = y
            console.log(this.h)
        }
        const scale = this.state.scale
        context.save()
        context.translate(x,this.y)
        context.beginPath()
        context.rect(w/2-(w/2)*scale,this.h/2 - (this.h/2)*scale,w/2+(w/2)*scale,this.h/2 + (this.h/2)*scale)
        context.clip()
        context.save()
        context.globalAlpha = 0.7
        context.fillStyle = '#2ecc71'
        context.fillRect(0,0,w,this.h)
        context.restore()
        this.textParts.forEach((textPart) => {
            textPart.draw(context,w/20)
        })
        context.restore()
    }
    updateY(h) {
        this.y -= h
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
    handleTap(x,y) {
        return x>=this.x && x<=this.x+this.w && y>=this.y && y<=this.y+this.h
    }
}
class TextPart {
    constructor(text,y) {
        this.text = text
        this.y = y
    }
    draw(context,x) {
        context.fillStyle = 'white'
        context.fillText(this.text,x,this.y)
    }
}
class NotifUIState {
    constructor() {
        this.scale = 0
        this.dir = 0
        this.prevScale = 0
    }
    update(stopcb) {
        this.scale += 0.1*this.dir
        if(Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb(this.prevScale)
        }
    }
    updateY() {

    }
    startUpdating(startcb) {
        if(this.dir == 0) {
            this.dir = 1-2*this.scale
            startcb()
        }
    }
}
class NotifUIContainer {
    constructor(x,y,w) {
        this.notifUIS = []
        this.x = x
        this.y = y
        this.w = w
        this.updating = []
    }
    addText(text,startcb) {
        var y = this.y
        const n = this.notifUIS.length
        if(n > 0) {
            y = this.y+this.notifUIS[n-1].y + this.notifUIS[n-1].h
        }
        const notifUI = new NotificationText(this.x,y,this.w,text)
        this.notifUIS.push(notifUI)
        this.updating.push(notifUI)
        this.startUpdating(notifUI,startcb)
    }
    draw(context) {
        this.notifUIS.forEach((notifUI)=>{
            notifUI.draw(context)
        })
    }
    update(stopcb) {
        this.updating.forEach((notifui,index)=>{
            notifui.update((scale)=>{
                this.updating.splice(index,1)
                stopcb()
                console.log("stopped")
                console.log(notifui)
            })
        })
    }
    startUpdating(notifui,startcb) {
        notifui.startUpdating(startcb)
    }
    handleTap(x,y,render) {
        this.notifUIS.forEach((notifUI,index) => {
            if(notifUI.handleTap(x,y)) {
                this.notifUIS.splice(index,1)
                for(var i=index;i<this.notifUIS.length;i++) {
                    const curr = this.notifUIS[i]
                    curr.updateY(notifUI.h)
                }
                render()
            }
        })
    }
}
class NotifAnimator {
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
const initNotificationStage = () => {
    const notifStage = new NotificationStage()
    notifStage.render()
    notifStage.startAddingText()
    notifStage.handleTap()
}
