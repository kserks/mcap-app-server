
import SelectFigureBar from './SelectFigureBar.js';
import Figure from './Figure.js';
import Board from './Board.js';

import LevelsControl from './LevelsControl.js';

const canvas = document.querySelector('.board__canvas');
const ctx = canvas.getContext('2d');


class Game {
    level = 0;
}


const fig = new SelectFigureBar();

let ID = null
let rotate = 0;
let flipH = false;
let flipV = false;
fig.onSelect((id, r, fH, fV)=>{
    ID = id
    rotate = r;
    flipH = fH;
    flipV = fV;
})




const board = new Board(canvas, ctx);
const levelsControl = new LevelsControl(board, fig);
// отрисовываю первый пустой уровень
levelsControl.setLevel(0);


// строю начальную структуру
board.reset();

// если фигура попала за пределы области видимости,
// то она удаляется и делаем активной фигуру в ножней панеле.
board.on('outside', id=>{
    fig.enable(id);    
});

// уровень пройден
board.on('complete', ()=>{
   
    setTimeout(()=>{
          board.reset();
          board.color = 'lightgreen';
          board.update();
          setTimeout(()=>{
                levelsControl.disable();
                levelsControl.open();
          }, 500)
    },500);
   
})


/**
 * Обработка клика по canvas
 */

board.on('click', (cell, x, y)=>{

            if(cell.id){
              fig.enable(cell.id);
              board.removeFigure(cell.id);

            };

            if(!ID) return;
            if(board.isExistFigure(ID)) return;

            fig.disable(ID);

            // Добавление фигуры
            const f =  new Figure(ID, x, y);
            f.rotate(rotate);
            if(flipH) f.flipH();
            if(flipV) f.flipV();
            board.setFigure(f);
            board.update();
            document.querySelector('.figure-json').innerText = JSON.stringify({id: ID, x, y, rotate, flipH, flipV})+','

            rotate = 0;
            flipH = false;
            flipV = false;
            ID = null;

            /*const f = board.getFigureById(F.id)
           
            f.forEach(pos=>{
                const cell = board.getCell (pos.x, pos.y)
                   console.log(cell)
            })*/



})






