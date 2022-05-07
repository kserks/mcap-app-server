import maps from './maps.js';
import Figure from './Figure.js';
/**
 * LEVELS
 */

const modalLevels = document.querySelector('.modal-levels');
const closeModal = document.querySelector('.modal-levels__close');
const levelsContainer = document.querySelector('.modal-levels__levels');
const openLevelsBtn = document.querySelector('.controls__item--grid');

class LevelsControl {
    index = 0;
    disabledLevels = [];
    #open = false;
    levels = Object.values(maps)
                   .flat()
                   .map(level=>{
                          return { body: level, disable: false }
                   });
    storageKey = 'квадрилион';

    constructor (board, figureControls){
      this.__board = board;
      this.__figureControls = figureControls; 
      this.mount();
      this.render();
    }
    mount (){
        this.load();
        openLevelsBtn.addEventListener('mousedown', ()=>{
          this.open();
        });

        closeModal.addEventListener('mousedown', ()=>{
          this.close()
        });

        levelsContainer.addEventListener('mousedown', e=>{
          if(e.target.tagName!=='IMG') return;
          const index = e.target.dataset.index;
          this.setLevel(index);
          this.close();  
        })
    }
    render (){
      levelsContainer.innerHTML = '';
      this.levels.forEach( (level, index)=>{
          const tpl = `<img src="images/levels/l_${index}.png" data-index="${index}" class="levels__level ${level.disable?'levels__level--disable':''}"/>`;
          levelsContainer.innerHTML += tpl;
      })
    }
    open (){
      this.render();
      this.#open = true;
      modalLevels.style.display = 'flex';
    }
    close (){
      this.#open = false;
      modalLevels.style.display = 'none';
    }
    disable (){
      this.disabledLevels.push(this.index);
      this.disableLevelsSwitch();
      this.save();

    }
    /*
    enable (index){
      this.levels[this.index].disable = false;
    }
    */
    save (){
      localStorage.setItem(this.storageKey, JSON.stringify(this.disabledLevels))
    }
    load (){
      const arr = localStorage.getItem(this.storageKey);

      if(!arr) return;
      this.disabledLevels = [...new Set( JSON.parse(arr) )];
      this.disableLevelsSwitch()
      this.open();
    }
    clearStorage (){
      localStorage.removeItem(this.storageKey);
    }
    disableLevelsSwitch (){
        this.disabledLevels.forEach( i => this.levels[i].disable = true )
    }
    setLevel (index){
        this.index = index;
        this.__board.reset();
        this.__figureControls.enableAll();
        this.levels[this.index].body.map(item=>{
          const { id , x, y, rotate, flipH, flipV } = item;
          const f = new Figure(id, x, y)
          f.rotate(rotate);
          if(flipH) f.flipH();
          if(flipV) f.flipV();
          //console.log(f)
          //if(!this.__board.isFiguresCollide(F)){
             // alert('Не все ячейки свободны')
             // return;
          //}
          this.__board.setFigure(f);
          this.__figureControls.disable(id)
        })
        this.__board.update();
    }
}


export default LevelsControl;