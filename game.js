const canvas = document.querySelector('#game')
const game = canvas.getContext('2d')
const btnUp = document.querySelector('#up')
const btnLeft = document.querySelector('#left')
const btnRight = document.querySelector('#right')
const btnDown = document.querySelector('#down')
const spanLives = document.querySelector('#lives')
const spanTime = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result')
const btnRestart = document.querySelector('#restar')

let canvasSize;
let elementsSize;
let level = 0
let lives = 3

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

let bombsPositions = []

window.addEventListener('load', setCanvasSize)
window.addEventListener('resize', setCanvasSize)
btnRestart.addEventListener('click', restartGame)

function fixNumber(n) {
    return Number(n.toFixed(0))
}

    // seteamos el tamaño del canvas o tablero de juego y los elementos internos
function setCanvasSize() {
    
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = fixNumber(canvasSize)
    
    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)
    
    elementsSize = canvasSize / 10

    elementsSize = fixNumber(elementsSize)
    
    playerPosition.x = undefined
    playerPosition.y = undefined
    startGame()
}

    // renderizamos los elementos dentro del tablero (canvas)
function startGame() {
    game.font = `${elementsSize}px Verdana`
    game.textAlign = 'end'

    const map = maps[level]

    if (!map) {
        gameWin()
        return
    }

    if (!timeStart) {
        timeStart = Date.now()
        timeInterval = setInterval(showTime, 100)
        showRecord()
    }

    const mapRows = map.trim().split('\n')
    const mapCols = mapRows.map(row => row.trim().split(''));
    
    ShowLives()

    bombsPositions = []
    game.clearRect(0, 0, canvasSize, canvasSize)

    mapCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col]
            const posX = fixNumber(elementsSize * (colI + 1))
            const posY = fixNumber(elementsSize * (rowI + 1))
            
            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = fixNumber(posX)
                    playerPosition.y = fixNumber(posY)
                }
            } else if (col == 'I') {
                giftPosition.x = fixNumber(posX)
                giftPosition.y = fixNumber(posY)
            } else if (col == 'X') {
                bombsPositions.push({
                    x: fixNumber(posX),
                    y: fixNumber(posY),
                })
            }

            game.fillText(emoji, fixNumber(posX), fixNumber(posY))
        })
    })

    movePlayer()
}

function movePlayer() {
    const giftCollisionX = fixNumber(playerPosition.x) == fixNumber(giftPosition.x)
    const giftCollisionY = fixNumber(playerPosition.y) == fixNumber(giftPosition.y)
    const giftCollision = giftCollisionX && giftCollisionY

    if (giftCollision) {
        levelWin()
    }
    
    const bombCollision = bombsPositions.find(bomb => {
        const bombCollisionX = fixNumber(bomb.x) == fixNumber(playerPosition.x)
        const bombCollisionY = fixNumber(bomb.y) == fixNumber(playerPosition.y)

        return bombCollisionX && bombCollisionY
    })
    
    if (bombCollision) {
        levelFail()
    }

    game.fillText(emojis['PLAYER'], fixNumber(playerPosition.x), fixNumber(playerPosition.y))
}

function levelWin() {
    level++
    startGame()
}

function levelFail() {
    lives--

    if (lives <= 0) {
        level = 0
        lives = 3
        timeStart = undefined
    }
    
    playerPosition.x = undefined
    playerPosition.y = undefined

    startGame()
}

function gameWin() {
    console.log('Gracias por jugar');
    clearInterval(timeInterval)

    const recordTime = localStorage.getItem('record_time')
    const playerTime = Date.now() - timeStart
    
    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime)
            pResult.innerHTML = 'Superaste el record'
        } else {
            pResult.innerHTML = 'No superaste el record'
        }
    } else {
        localStorage.setItem('record_time', playerTime)
        pResult.innerHTML = 'Primera vez que buen tiempo, ahora intenta superarlo'
    }

    btnRestart.style.display = 'inline-block'
}

function restartGame() {
    location.reload()
}

function ShowLives() {
    const heartsArray = Array(lives).fill(emojis['HEART'])

    // spanLives.innerHTML = heartsArray.join('') short way
    spanLives.innerHTML = ""
    heartsArray.forEach(heart => spanLives.append(heart))
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time')
}

window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp)
btnLeft.addEventListener('click', moveLeft)
btnRight.addEventListener('click', moveRight)
btnDown.addEventListener('click', moveDown)

function moveByKeys(event) {
    if (event.key == 'ArrowUp') moveUp()
    else if (event.key == 'ArrowLeft') moveLeft()
    else if (event.key == 'ArrowRight') moveRight()
    else if (event.key == 'ArrowDown') moveDown()
}

function moveUp() {
    if ((playerPosition.y - elementsSize) < elementsSize) {
    } else {
        playerPosition.y -= elementsSize
        startGame()
    }
}

function moveLeft() {
    if ((playerPosition.x - elementsSize) < elementsSize) {
    } else {
        playerPosition.x -= elementsSize
        startGame()
    }
}

function moveRight() {
    if ((playerPosition.x + elementsSize) > canvasSize) {
    } else {
        playerPosition.x += elementsSize
        startGame()
    }
}

function moveDown() {
    if ((playerPosition.y + elementsSize) > canvasSize) {
    } else {
        playerPosition.y += elementsSize
        startGame()
    }
}