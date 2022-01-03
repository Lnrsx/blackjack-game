const { ipcRenderer } = require('electron')

const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');

var hitbutton = document.getElementById("hit-button")
var standbutton = document.getElementById("stand-button")

var gameoverpopup = document.getElementById("gameover-popup")
var gamewinner = document.getElementById("game-winner")
var restartgame = document.getElementById("restart-button")

canvas.width = 800;
canvas.height = 600;

// Position game over popup in the center of the canvas and hide it
gameoverpopup.style.left = `${canvas.width/2 - 49}px`
gameoverpopup.style.top = `${canvas.height/2 - 28}px`
gameoverpopup.hidden = true

// Placeholder for backend game state retrieval
cardsize = {
    height: 125,
    width: 82
}

anchors = {
    player: {
        posX: 400 - (cardsize.width / 2),
        posY: 500 - (cardsize.height / 2),
    },
    dealer: {
        posX: 400 - (cardsize.width / 2),
        posY: 100 - (cardsize.height / 2),
    },
    deck: {
        posX: 700 - (cardsize.width / 2),
        posY: 100 - (cardsize.height / 2),
    }
}

gamestate = {
    player: [],
    dealer: [],
}
var dealer_card_hidden = true,

card_numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "K", "Q", "A"]
card_suits = ["H", "D", "S", "C"]
imagecache = { }

card_suits.forEach(suit => {
    card_numbers.forEach(number => {
        cardimage = new Image();
        cardimage.src = `../assets/cards100/${number}${suit}.png`
        imagecache[`${number}${suit}`] = cardimage
    })
})

hidden_card = new Image();
hidden_card.src = `../assets/cards100/blue_back.png`

function drawstaticgamestate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // draws the hand of the player and dealer (or every entry in the gamestate object)
    for (const [unit, hand] of Object.entries(gamestate)) {
        // changes hand achor so that hand is always horizontally aligned
        gamestate[unit].forEach(function (card, index) {
            var cardimage
            if (unit == "dealer" && dealer_card_hidden && index == 1) {
                cardimage = hidden_card
            } else {
                cardimage = imagecache[card]
            }
            // hand starting point needs to be decalred inside the loop for some reason
            var handstartpoint = anchors[unit].posX - (hand.length * cardsize.width / 2)
            var imagex = handstartpoint + (cardsize.width * index)
            var imagey = anchors[unit].posY
            // Only attempts to draw if the image has been loaded
            if (cardimage.complete) {
                ctx.drawImage(
                    cardimage,
                    imagex,
                    imagey,
                    cardsize.width,
                    cardsize.height,
                )
            } else {
                // If the image is not readym redraw the image when loaded
                imagecache[card].onload = function() {
                    drawstaticgamestate()
                }
            }
        })
    }
 
    // Draws deck image (will stay static during game)
    if ('deckimage' in imagecache) {
        // Gets deck image from imagecache if it has already been loaded
        deckimage = imagecache['deckimage']
    } else {
        // Load image if it has not already been (will only happen at start of game)
        deckimage = new Image();
        deckimage.src = '../assets/cards100/deck.png'
        deckimage.onload = function() {
            ctx.drawImage(
                deckimage,
                anchors.deck.posX,
                anchors.deck.posY,
                cardsize.width,
                cardsize.height
            )
            imagecache['deckimage'] = deckimage
        }
    }
    ctx.drawImage(
        deckimage,
        anchors.deck.posX,
        anchors.deck.posY,
        cardsize.width,
        cardsize.height
    )
}

async function processapl(event_list) {
    for (const event of event_list) {
        switch (event.action) {
            case "deal":
               gamestate[event.unit].push(event.card)
               drawstaticgamestate()
               break
            case "end":
                dealer_card_hidden = false;
                drawstaticgamestate()
                if (event.winner == "draw") {
                    gamewinner.innerHTML = 'draw'
                } else {
                    gamewinner.innerHTML = `${event.winner} won`
                }
                gameoverpopup.hidden = false
                break
            case "player_turn":
                hitbutton.classList.remove("action-button-inactive")
                standbutton.classList.remove("action-button-inactive")
                break
            case "unhide_dealer_card":
                dealer_card_hidden = false;
                drawstaticgamestate()
            default:
                console.log(`Unknown action: ${event.action}`)
        }
        await new Promise(r => setTimeout(r, 500));
    }
}

function fetchapl() {
    var boardID = ipcRenderer.sendSync('getboardID')
    ipcRenderer.send('request', `getapl/${boardID}`)
}

restartgame.onclick = function() {
    window.location.href = "../app/index.html"
}

hitbutton.onclick = function() {
    var boardID = ipcRenderer.sendSync('getboardID')
    ipcRenderer.send('request', `hit/${boardID}`)
}

standbutton.onclick = function() {
    var boardID = ipcRenderer.sendSync('getboardID')
    ipcRenderer.send('request', `stand/${boardID}`)
}

ipcRenderer.on('hit-response', (event, response) => {
    hitbutton.classList.add("action-button-inactive")
    standbutton.classList.add("action-button-inactive")
    fetchapl()
})

ipcRenderer.on('getapl-response', async (event, response) => {
    var actionlist = JSON.parse(response)
    await processapl(actionlist)
})

ipcRenderer.on('stand-response', (event, response) => {
    hitbutton.classList.add("action-button-inactive")
    standbutton.classList.add("action-button-inactive")
    fetchapl()
})

hitbutton.classList.add("action-button-inactive")
standbutton.classList.add("action-button-inactive")
fetchapl()