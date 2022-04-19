function $(selector){
  return document.querySelector(selector)
}

class Manga {
  index = 0;
  float = 0;
  constructor (body, title, chapterTitle, root){
    this.root = root;
    this.body = body;
    this.title = title;
    this.chapterTitle = chapterTitle;
    this.list = Object.keys(body);
    this.float = this.list.indexOf(this.chapterTitle);
  }


  get img (){
    return this.chapter[this.index];
  }
  get chapter (){
    return this.body[this.list[this.float]];
  }
  get url (){
    return `url(${this.root}store/${this.title}/${this.chapterTitle}/${this.img})`;
  }
  get progress (){
    return `
            <div>${this.float+1} / ${this.list.length}</div>
            <div>${this.index+1} / ${this.chapter.length}</div>
           `
  }
  render (){
    $('.viewer').style.backgroundImage = this.url;
    $('.progress__data').innerHTML = this.progress;
  }

  reset(){
    this.index = 0;

    this.render();
  }
  prev(){
    --this.index

    if(this.index<0){
      --this.float
      
      if(this.float<0){
        this.float = 0
        this.index = 0
      }
      else{
        this.index = this.chapter.length-1
      }
      this.chapterTitle = this.list[this.float]
      

    }
    
    this.render()
  }
  next(){
    
    // end chapter
    if(this.index===this.chapter.length-1){
      
      if(this.float===this.list.length-1){
        this.float = this.list.length-1
        this.index = this.chapter.length-1
      }
      else{
        ++this.float
        this.index = 0
      }
      this.chapterTitle = this.list[this.float]
    }
    else{
      ++this.index
    }
    this.render()
  }
  isWall(){

  }
}