const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const spanResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined
};

const giftPosition = {
    x: undefined,
    y: undefined
}

let enemyPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize () {
// funcion que le da tamaño al canvas
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvasSize = canvasSize;

    console.log("canvas size " + canvasSize)

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
}

function startGame() {
     // funcion que renderiza elementos del juego
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    // metodo para tranformar un string en un  arreglo bidimencional
    const map = maps[level];
    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n'); // se crea el primer arreglo
    //trim quita los espacios del arreglo al inicio y al final, 
    // split crea un arreglo a partir de un string, el inicio y el final de cada arreglo es cuando detecta un salto de linea \n
    const mapRowCols = mapRows.map(row => row.trim().split('')); // se crea el segundo arreglo
    
    showLives();

    enemyPositions = [];
    game.clearRect(0, 0, canvasSize, canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);
           // console.log("posx y posy " + posX, posY)
            console.log(`posx ${posX} y posy ${posY}`)
            if ( col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log("player position " + (playerPosition.x) + " " + (playerPosition.y));
                }
                console.log("player position 2 " + (playerPosition.x) + " " + (playerPosition.y));
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
                console.log("giftposition " + giftPosition.x, giftPosition.y)
            } else if (col == 'X') {
                enemyPositions.push({
                    x: posX,
                    y: posY
                })
            }
            game.fillText(emoji, posX, posY);
        });
    });
    
    movePlayer();
    
}

function movePlayer() {
    const giftCollisionX = Number(playerPosition.x).toFixed(3) == Number(giftPosition.x).toFixed(3);
    const giftCollisionY = Number(playerPosition.y).toFixed(3) == Number(giftPosition.y).toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        levelWin();
    }

    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = Number(enemy.x).toFixed(3) == Number(playerPosition.x).toFixed(3);
        const enemyCollisionY = Number(enemy.y).toFixed(3) == Number(playerPosition.y).toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    })
    if (enemyCollision) {
        levelFail();
        
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('subiste de lvl');
    level++;
    startGame();
}

function levelFail() {
    lives--;
    
    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }  
    
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin(){
    console.log('gananste');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = ((Date.now() - timeStart)/1000).toFixed(0);

    if (recordTime) {
        
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            spanResult.innerHTML = '¡Superaste el record!';
        } else {
            spanResult.innerHTML = 'No superaste el record.';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        spanResult.innerHTML = 'Primera vez? Muy bien, ahora trata de superar el record.';
    }
}

function showLives () {
    const heartArray = Array(lives).fill(emojis['HEART']); 

    spanLives.innerHTML = "";
    heartArray.forEach(heart => spanLives.append(heart));
}

function showTime(){
    spanTime.innerHTML = ((Date.now() - timeStart)/1000).toFixed(0);
}

function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);

btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event){
    if(event.key == 'ArrowUp') {
        moveUp();
    } else if (event.key == 'ArrowLeft') {
        moveLeft();
    } else if (event.key == 'ArrowRight') {
        moveRight();
    } else if (event.key == 'ArrowDown') {
        moveDown();
    }
}

function moveUp() {
    if ((playerPosition.y - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    if ((playerPosition.x - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}

function moveRight( ) {
    if ((playerPosition.x + elementsSize) >= canvasSize) {
        console.log('OUT');
        console.log("player position x "+ playerPosition.x)
        console.log("element size "+ elementsSize)
        console.log("canvas size "+ canvasSize)
    } else {
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown() {
    if ((playerPosition.y + elementsSize) > canvasSize) {
        console.log('OUT');
    } else {
        playerPosition.y += elementsSize;
        startGame();
    }
}

