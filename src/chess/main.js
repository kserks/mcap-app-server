
    import {ChessConsole} from "./src/ChessConsole.js"
    import {LocalPlayer} from "./src/players/LocalPlayer.js"
    import {Board} from "./src/components/Board/Board.js"
    import {History} from "./src/components/History.js"
    import {CapturedPieces} from "./src/components/CapturedPieces.js"
    import {HistoryControl} from "./src/components/HistoryControl.js"
    import {Persistence} from "./src/components/Persistence.js"
    import {Sound} from "./src/components/Sound.js"
    import Timer from './src/Timer.js'



  
    new ChessConsole(
        document.getElementById("console-container"),
        {name: "Игрок 1", type: LocalPlayer},
        {name: "Игрок 2", type: LocalPlayer},
        {
            figuresSpriteFile: "./assets/chessboard-sprite-staunty.svg",

        }
    ).initialization.then((chessConsole) => {
        new Board(chessConsole).initialization.then(() => {
            new Persistence(chessConsole, {
                savePrefix: "Local"
            }).load()
        })

        new History(chessConsole, {
            notationType: "figures"
        })

        new CapturedPieces(chessConsole)

        new Sound(chessConsole, {
            soundSpriteFile: "./assets/sounds/chess.mp3"
        })
    })



 

/**
 * TIMERS
 */

const $timerTpl = 
        $(`<div class="chess-timer">
            <div class="chess-timer__btn-wrapper">
                <div class="chess-timer__player chess-timer__player--1"></div>
                <div class="chess-timer__player chess-timer__player--2"></div>
            </div>

        </div>`)
$('.chess-console-left').append($timerTpl)




var gameTime = 10


$('.modal__close').on('click', function (){
    $('.modal').hide()
})

function notify (msg){
    $('.modal__msg').html(msg)
    $('.modal').css('display', 'flex')
}



/**
 * NEW GAME
 */

//add btn 
let $tpl = `

    <div class="game__control">
 
                <div id="flip_board"><i class="fas fa-adjust"></i></div>
                
                <div class="number-input">
                  <button id="minus" ></button>
                  <input class="quantity" type="number" id="timer__value"  min="1" max="60" value="10" step="1">
                  <button  id="plus" class="plus"></button>
                </div>

    </div>
     <div id="new_game">Новая игра</div>
`
$('.chess-console-left').append($tpl)

$('#new_game').on('mousedown', function (){
    localStorage.clear()
    location.reload()
})

var playerClick1 = false
var playerClick2 = false




var t1 = new Timer( gameTime, function (time){
            $('.chess-timer__player--1').html(time);
         })

    t1.onEnd(()=>{
            notify("Время закончилось");
    })

var t2 = new Timer( gameTime, function (time){
            $('.chess-timer__player--2').html(time);
         })
    t2.onEnd(()=>{
            notify("Время закончилось");
    })
    setTimeout(()=>{
        console.log(t2.str)
    },4000)
/**/

var _gameTime = null
function changeTimerHandler (data){

    _gameTime = data
    t1.stop()
    t2.stop()
    t1.set( _gameTime )
    t2.set( _gameTime )
    playerClick1 = false
    playerClick2 = false
    $('.chess-timer__player--1').html( _gameTime+':00').removeClass('active-timer')
    $('.chess-timer__player--2').html( _gameTime+':00').removeClass('active-timer')

}

$('#timer__value').on('change', function (){
    changeTimerHandler(Number( $(this).val() ))
})

$('#console-container').on('click', '#minus', function (){
    this.parentNode.querySelector('input[type=number]').stepDown()
    changeTimerHandler(Number( $('input[type=number]').val() ))
})
$('#console-container').on('click', '#plus', function (){
    this.parentNode.querySelector('input[type=number]').stepUp()
    changeTimerHandler(Number( $('input[type=number]').val() ))
})


/*reset*/
$('.chess-timer__control .fa-redo-alt').on('mousedown', function (){
    
    
    $('.chess-timer__player--1').html(t1.reset()).removeClass('active-timer')
    $('.chess-timer__player--2').html(t2.reset()).removeClass('active-timer')
    playerClick1 = false
    playerClick2 = false
})




/*
 * Player 1
 */


$('.chess-timer__player--1').on('mousedown', function (){
        if(playerClick1){
            playerClick1 = false
            t1.stop()
            $(this).removeClass('active-timer')
        }
        else{
            playerClick1 = true
            t1.start()
            t2.stop()
            playerClick2 = false
            $('.chess-timer__player--2').removeClass('active-timer')
            $(this).addClass('active-timer')
        }
})

/*
 * Player 2
 */


$('.chess-timer__player--2').on('mousedown', function (){
        if(playerClick2){
            playerClick2 = false
            t2.stop()
            $(this).removeClass('active-timer')
        }
        else{
            playerClick2 = true
            t1.stop()
            playerClick1 = false
            $('.chess-timer__player--1').removeClass('active-timer')
            t2.start()
            $(this).addClass('active-timer')
        }
})


$('#console-container').on('mousedown', '.chess-console-board .top', function (){

try {
      window.mcefQuery({
        request: "info",
        persistent: true,
        onSuccess:response=>{
          var player = JSON.parse(response)
          this.innerHTML = player.name
        }
      })
 } catch (err) {
      this.innerHTML = 'mcap_uknown'
}

})
$('#console-container').on('mousedown', '.chess-console-board .bottom', function (){

try {
      window.mcefQuery({
        request: "info",
        persistent: true,
        onSuccess:response=>{
          var player = JSON.parse(response)
          this.innerHTML = player.name
        }
      })
 } catch (err) {
      this.innerHTML = 'mcap_uknown'
}

})
