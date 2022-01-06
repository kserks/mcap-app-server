import { Board } from './Board.js'


const width = 1024
const height = 717
const canvas = document.querySelector('.canvas-container #canvas_1')
      canvas.width = width
      canvas.height = height
const ctx = canvas.getContext('2d')


export const board = new Board(canvas, ctx)

window.board = board

const mode = {}

export function addMode (id, callback){
  mode[id] = callback.bind(board)
}

function exec(mode_id, data){
      board.currentMode = mode_id
      mode[mode_id](board.point_1, board.point_2, data)
      board.point_1 = null
      board.point_2 = null
}


//export board
export function selectMode (mode_id, click, data){
      board.point_1 = null
      board.point_2 = null
  if(click===0){

      exec(mode_id, data)
  }

  board.evt.off('select-point_1')
  board.evt.on('select-point_1', function (){
    if(click===1){
        exec(mode_id, data)
    }

  })
  board.evt.off('select-point_2')
  board.evt.on('select-point_2', function (){
    if(click===2){
        exec(mode_id, data)
    }


})

}






export function setColor (color){
  board.color = color
}

