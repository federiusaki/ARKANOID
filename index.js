const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const $sprite = document.querySelector ('#sprite')
const $bricks = document.querySelector('#bricks')

/* canvas.width = 448
canvas.height = 400 < >*/

const bricksRow = 8;
const bricksColumn = 13;
const bricksWidth = 50
const bricksHeight = 20
const bricksPadding = 3
const bricksOffSetTop = 80
const bricksOffSetLeft = 50
const bricks = []
const brickStatus = {
    fresh: 1,
    hit: 0
}

for ( let c = 0; c < bricksColumn; c++){
    bricks[c] = [] //start bricks vacios
    for (let r = 0; r < bricksRow; r++){
        //calcular posicion bricks
        const brickX = c * (bricksWidth + bricksPadding) + bricksOffSetLeft
        const brickY= r * (bricksHeight + bricksPadding) + bricksOffSetTop  
        //color random
        const random = Math.floor(Math.random() * 8)
        bricks[c][r] = {
            x: brickX,
            y: brickY,
            status: brickStatus.fresh,
            color: random
        }
    }
}


const ballRadius = 4;
let x = canvas.width / 2
let y = canvas.height - 30
let directionX = 5
let directionY = -5

const paddleWidth = 50;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = (canvas.height - paddleHeight) - 10

let rightKeyPressed = false
let leftKeyPressed = false

function drawBall() {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()
}

function drawPaddle() {
/*     ctx.fillRect(
        paddleX, //pos x
        paddleY, //pos y 
        paddleWidth, // ancho dibujo
        paddleHeight //alto dibujo
    ) */
    ctx.drawImage(
        $sprite,
        29, //cordenadas de recorte
        174,
        paddleWidth, //tamaño recorte
        paddleHeight,
        paddleX, //posicion de dibujo
        paddleY,
        paddleWidth, //ancho dibujo
        paddleHeight
    )
}

function drawBricks() {
    for ( let c = 0; c < bricksColumn; c++){
        for (let r = 0; r < bricksRow; r++) {
            currentBrick =  bricks[c][r]
            if ( currentBrick.status === brickStatus.hit )
                continue;
   
            
            const clipX = currentBrick.color * 32

            ctx.drawImage(
                $bricks,
                clipX,
                0,
                32,
                14,
                currentBrick.x,
                currentBrick.y,
                bricksWidth,
                bricksHeight
            )
            
        }
    }
 }
 function collision() {
    for (let c = 0; c < bricksColumn; c++) {
      for (let r = 0; r < bricksRow; r++) {
        const currentBrick = bricks[c][r]
        if ( currentBrick.status === brickStatus.hit ) continue;

        const isBallSameXAsBrick =
          x > currentBrick.x &&
          x < currentBrick.x + bricksWidth

        const isBallSameYAsBrick =
          y > currentBrick.y &&
          y < currentBrick.y + bricksHeight

        if (isBallSameXAsBrick && isBallSameYAsBrick) {
          directionY = -directionY
          currentBrick.status = brickStatus.hit
        }
      }
    }
  }

function ballMovement() {
    if (
        x + directionX > canvas.width - ballRadius || //derecha pared
        x + directionX < 0 //pared izq
    ) {
        directionX = -directionX
    }

    if (y + directionY < 0) {
        directionY = -directionY
    }
    // tocando el paddle
    const isBallOnPaddleX = x > paddleX && x < paddleX + paddleWidth 
    const isBalltouchingPaddle = y + directionY > paddleY

    if (isBallOnPaddleX && isBalltouchingPaddle ){
        directionY = -directionY
    }
    else if (y + directionY > canvas.height - ballRadius) {
        console.log("gameover")
        document.location.reload()
    }

    //movimiento
    x += directionX
    y += directionY
}

function paddleMovement() {
    if ( rightKeyPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 10
    }else if ( leftKeyPressed && paddleX > 0 ){
        paddleX -= 10
    }

}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function initEvent() {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler (event) {
        const {key} = event
        if ( key === 'Right' || key === 'ArrowRight' ){
            rightKeyPressed = true
        }else if ( key === 'Left' || key === 'ArrowLeft' ){
            leftKeyPressed = true
        }
    
    }

    function keyUpHandler (event) {
        const {key} = event
        if ( key === 'Right' || key === 'ArrowRight' ){
            rightKeyPressed = false
        }else if ( key === 'Left' || key === 'ArrowLeft' ){
            leftKeyPressed = false
        }
    
    }


}



function draw() {
   
    cleanCanvas()
    //elementos
    drawBall()
    drawPaddle()
    drawBricks()

    //movimiento
    collision()
    ballMovement()
    paddleMovement()

    window.requestAnimationFrame(draw)
}
draw() 
initEvent()