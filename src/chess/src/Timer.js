export default class Timer {
    constructor (_time, tick){
        this.tid = null
        this.originalTime = _time
        this.time = _time*60
        this.tick = tick
        this.endHandler = null
        this.settime = null
        this.str = `${Math.trunc(this.time/60%60)}:${this.time%60}0`
        this.tick(this.str)
    }
    start (){
        this.tid = setInterval(()=>{
            let min = this.time/60%60
            let sec = this.time%60
            if (this.time <= 0) {
                clearInterval(this.tid);
                this.endHandler()
            }
            
            if(min===0&&String(sec).length===1){
                this.str = `${Math.trunc(min)}:${sec}0`;
            }
            else if (String(sec).length===1){
                this.str = `${Math.trunc(min)}:${sec}0`;
            }
            else{
                this.str = `${Math.trunc(min)}:${sec}`;
            }
            this.tick(this.str)
            --this.time;
        }, 1000)
    }
    onEnd (endHandler){
        this.endHandler = endHandler
    }
    stop (){
        clearInterval(this.tid)
    }
    reset (){
        this.stop()
        this.time = (this.settime||this.originalTime) * 60
        return this.time
    }
    set (_time){
        this.settime = _time
        this.time = _time*60
    }
}

