class NotificationStage extends CanvasStage {
    constructor() {
        super()
    }
    render() {
        super.render()
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
        context.font = context.font.replace(/\d/g,20)
        if(this.textParts.length == 0) {
            var msg = ""
            var words = this.text.split(" ")
            var y = 20
            for(var i=0;i<words.length;i++) {
                if(context.measureText(msg+words[i]).width > 0.9*w) {
                    this.textParts.push(new TextPart(msg,y))
                    y += 40
                }
                else {
                    msg = msg+words[i]
                }
            }
            y += 40
            this.h = y
        }
        const scale = this.state.scale
        context.save()
        context.translate(x,this.y)
        context.beginPath()
        context.rect(w/2-(w/2)*scale,0,w/2+(w/2)*scale,this.h)
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
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startUpdating)
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
            this.dir = 1-2*this.state.scale
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
        const notifUI = new NotificationText(this.x,this.y,this.w,text)
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
                this.updatin.splice(index,1)
                stopcb()
            })
        })
    }
    startUpdating(notifui,startcb) {
        notifui.startUpdating(startcb)
    }
    handleTap(x,y) {

    }
}
