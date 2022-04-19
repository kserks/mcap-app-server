class CoversControl {
  constructor (covers, index=0, root){
    this.covers = covers;
    this.index = index;
    this.root = root;
    this.$viewer = $('.viewer');
    this.mount();
  }
  mount (){
    this.render();
    this.$viewer.style.display = 'flex';
  }
  get title (){
    return this.covers[this.index];
  }
  get url (){
    return `url(${this.root}store/${this.title}/cover.jpg)`;
  }
  historyPushTitle (){
    history.pushState(null, null, '?title='+ this.title);
  }
  next (){
    this.index++;
    if(this.index>this.covers.length-1){
      this.index = 0;
    }
    this.render();
  }
  prev (){
    this.index--;
    if(this.index<0){
      this.index = this.covers.length-1;
    }
    this.render();
  }
  render (){
    this.$viewer.style.backgroundImage = this.url;
    $('.progress__data').innerHTML = this.progress;
    //this.historyPushTitle();
  }
  get progress (){
    return `<div>${this.index+1} / ${this.covers.length}</div>`
  }
}
