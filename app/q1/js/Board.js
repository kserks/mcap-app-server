
class Board {
  
  constructor (canvas, ctx, figures=[]){
    this.canvas = canvas;
    this.ctx = ctx;
    this.figures = figures;
    this.COLS = 11;
    this.ROWS = 5;
    this.BLOCK_SIZE = 80;
    this.width = this.COLS * this.BLOCK_SIZE + 11; // 11 - это допуск учитывающий отступы между ячеек
    this.height = this.ROWS * this.BLOCK_SIZE + 5;
    this.color = 'gray';
    this.events = {
      click: Function(),
      outside: Function(),
      complete: Function()
    };
    //this.offTheBoardFlag = false;
    this.init()
  }
  init (){
    // Устанавливаем размеры холста
    this.ctx.canvas.width = this.width;
    this.ctx.canvas.height = this.height;
    // Получаем координаты курсора мыши
    this.canvas.addEventListener('mousedown', e=>{
        const { left, top } = e.target.getBoundingClientRect();
        this.x = e.clientX - left;
        this.y = e.clientY - top;
        const eventData = { x: this.x, y: this.y, width: 0.5, height: 0.5 }
        this.onClick(eventData);
    })
  }

  onClick (eventData){
    
    this.grid.map( (row, y) => {
        row.map( (cell, x) => {
            const collide =  this.collision(cell, eventData);
            if(collide){

                this.events.click(cell, x, y);
                setTimeout(()=>{
                  if(this.isLevelComplete()){
                      this.events.complete();
                  }
                }, 100)
            }

        })
    })

  }
  setFigure (value){
    this.figures.push(value);
   // this.render();
    //this.update();
  }
  on(event, handler){
    this.events[event] = handler;
  }
  reset (){
    this.figures = [];
    this.color = 'gray';
    this.update();
  }
  update (){
    this.grid = this.getEmptyGrid();
    this.render();
  }
  /**
   * Подготавливаем данные на основе которых будет формироваться сетка
   */
  getEmptyGrid (){
    // step
    // (+1px) - необходимо добавить как отсуп между ячейками.
    // При сравнении пересечения площадей выбранной ячейки и площади объекта курсора.
    // Если расстояние между ячейками отсутсвует, то при клике я могу выделить несколько ячеек
    // Это происходит, когда кликаешь на стык между ячейками.
    // Происходит выделение от двух, до четырех ячеек. Но надо стараться попать на стык.
    const step = 1;
    // сумма отступа от предыдущей ячейки
    let stepX = 0;
    let stepY = 0;
    const grid = [];
    // проходим по строкам
    for(let row = 0; row < this.ROWS; row++){
          grid[row] = [];
          // проходим по столбцам
          for(let col = 0; col < this.COLS; col++){
                // пустая ячейка
                const cell = {
                        width: this.BLOCK_SIZE,
                        height: this.BLOCK_SIZE,
                        x: stepX,
                        y: stepY,
                        value: 0,
                        color: this.color,
                        id: null
                }
                // Смещение по X
                stepX += this.BLOCK_SIZE+step;
                grid[row].push(cell);
          }
          // начинаем отрисовывать каждую строчку с начала
          stepX = 0;
          // смещение по Y
          stepY += this.BLOCK_SIZE+step;
    }
    return grid;

  }
  /**
   * Перерисовать все фигуры которые находятся в массиве grid
   */
  render (){
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.grid = this.mergeFiguresToGrid();
    //this.grid[3][2].color = 'red'
    //this.ctx.strokeStyle = "silver";

    this.grid.map( (row, y) => {
        row.map( (cell, x) =>{
            this.ctx.fillStyle = cell.color;
            this.ctx.fillRect(cell.x, cell.y, cell.width, cell.height );
            //this.ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
        });
    });

  }
  /**
   * Добавление фигур в массив отрисовки
   */
  
  mergeFiguresToGrid (){
    this.figures.map(f=>{
        f.shape.map((row, y)=>{
            row.map((value, x)=>{
                if(value>0){
                    try{
                      //this.offTheBoardFlag = false;
                      this.grid[y+f.y][x+f.x].value = value;
                      this.grid[y+f.y][x+f.x].color = f.color;
                      this.grid[y+f.y][x+f.x].id = f.id;
                    }
                    catch(err){
                      this.events.outside(f.id);
                      this.removeFigure(f.id);
                    }
                }
            })
        })
    });
    return this.grid;
  }
  /**
   * Возвращает массив с координатами ячеек,
   * которые занимает фигура с заданным ID
   */
  getFigureById (id){
    const coords = [];
    this.grid.map( (row, y) => {
        row.map( (cell, x) => {
            if(cell.id===id){
              cell.x = x;
              cell.y = y;
              delete cell.width;
              delete cell.height;
              coords.push(cell);
            }
        })
    });

    return coords;

  }
  removeFigure (id){
    /**
     * Получаю список координат ячеек заполненных фигурой
     */
    const cells = this.getFigureById(id);
    /**
     * Пробегаюсь по полученным ячейкам и сбрасываю их 
     * на значение по умолчанию
     */
    cells.map( cell=>{
        this.grid[cell.y][cell.x].color = this.color;
        this.grid[cell.y][cell.x].value = 0;
        this.grid[cell.y][cell.x].id = null;
    });
    /**
     * Удаляю фигуру из общего массива
     */
    for (let f = 0; f<this.figures.length;f++){
        if(this.figures[f].id===id){
          this.figures.splice(f, 1);
          break;
        }
    }
    this.update();
  }
  /**
   * Проверка столкновения прямоугольников
   * Используется для проверки стокновения курсора с ячейкой.
   */
  collision(obj1, obj2){
    let XColl=false;
    let YColl=false;
    if ((obj1.x + obj1.width >= obj2.x) && (obj1.x <= obj2.x + obj2.width)) XColl = true;
    if ((obj1.y + obj1.height >= obj2.y) && (obj1.y <= obj2.y + obj2.height)) YColl = true;
    if (XColl&YColl){return true;}
    return false;
  }
  getCell (x, y){
    return this.grid[y][x];
  }
  /*
  removeDuplicateFigure (id){
    let index;
    this.figures.map( (item, pos)=>{
          if(item.id===id){
            index = pos
          }
    })

    if(!index) return;
    this.figures.splice(index, 1);
    index = false;
  }
  */
  /*
  isFiguresCollide (F){
    
    return F.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = F.x + dx;
        let y = F.y + dy;
        //console.log(dx, dy)
        return value === 0 ||this.notOccupied(x, y)
      });
    });

  }
  notOccupied (x, y) {
    return 0;
    //console.log(x, y)
    return this.grid[y] && this.grid[y][x].value === 0;
  }*/
  isExistFigure (id){
    return this.figures.find(f=>f.id===id);
  }
  isLevelComplete (){
    let status = false
    let i = 0;
    this.grid.map( (row, y) => {
        row.map( (cell, x) => {
            if(cell.value===1){
              i++
            }

        })
    });
    if(i===55){
      status = true;
    }
    return status;
  }
}


export default Board;

