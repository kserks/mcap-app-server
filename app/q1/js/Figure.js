
import TYPES from './types.js'

/**
 * pointerY - точка построения. Смещение. 
 * В обычном режиме фигура строится с верхнего левого угла
 * Но нам надо при клике построить фигуру так, что бы она интуитивно занимало
 * место определенным углом от места клика.
 */
class Figure {
  #x = 0;
  #y = 0;
  #pointerX = 0;
  #pointerY = 0;
  #n = 0;
  mode = 0;
  V = false;
  H = false;

  constructor (id, x, y){
    this.id = id
    this.x = x;
    this.y = y;
    this.TYPES = JSON.parse(JSON.stringify(TYPES))
    this.color = this.TYPES[this.id].color;
    this.shape = this.TYPES[this.id].shape;
  }
  set x (val){
      this.#x = val;
  }
  get x (){
    return this.#x - this.pointerX;
  }
  set y (val){
      this.#y = val;
  }
  get y (){
    return this.#y - this.pointerY;
  }

  get transformMode (){
    this.mode = 0;
    if(this.H&&!this.V){
      this.mode = 1;
    }
    if(this.V&&!this.H){
      this.mode = 2;
    }
    if(this.H&&this.V){
      this.mode = 3;
    }

    return this.mode;
  }
  /**
   * При вращении и отражении фигуры, меняется позиция курсора.
   * Точки откуда берет начало фигура
   */
  get pointerX (){
    return this.TYPES[this.id].pointer[this.rotatePos][this.transformMode].x;
  }

  get pointerY (){
    return this.TYPES[this.id].pointer[this.rotatePos][this.transformMode].y;
  }
  /**
   * Сколько раз крутанули фигуру
   */
  get rotatePos (){
    return this.#n;
  }
  set rotatePos (n){
    this.#n = n;
  }
  flipV (){
      this.V = !this.V;
      this.shape.reverse();
  }
  flipH (){
      this.H = !this.H;
      this.shape =  this.shape.map( row => row.reverse() );
  }

  rotate (n){
    this.rotatePos = n;
    // скольлко раз крутануть
    for(let i = 0; i<n; i++){
          // линейно меняем значения в матрице
          for (let y = 0; y < this.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
              [this.shape[x][y], this.shape[y][x]] =  [this.shape[y][x], this.shape[x][y]];

            }
          }
          this.shape = this.shape.map(row => row.reverse());
    }
  }

}


export default Figure;