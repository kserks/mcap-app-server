class Evt {
  constructor (){
    this.events = {}
  }
  on (event, handler){
      if(!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(handler);
     
  }
  emit (event, ...args){
      if(event in this.events) {
          this.events[event].forEach(handler=>handler.call(this, ...args))
      }
      else {
        console.error('Event not defined')
      }

  }
  off (event){
    delete this.events[event]
  }
}




export default new Evt()


