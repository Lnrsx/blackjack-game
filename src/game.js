const { ipcRenderer } = require('electron')

const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');

var hitbutton = document.getElementById("hit-button")
var standbutton = document.getElementById("stand-button")

canvas.width = 800;
canvas.height = 600;

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

function drawstaticgamestate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // draws the hand of the player and dealer (or every entry in the gamestate object)
    for (const [unit, hand] of Object.entries(gamestate)) {
        // changes hand achor so that hand is always horizontally aligned
        gamestate[unit].forEach(function (card, index) {
            // hand starting point needs to be decalred inside the loop for some reason
            var handstartpoint = anchors[unit].posX - (hand.length * cardsize.width / 2)
            var imagex = handstartpoint + (cardsize.width * index)
            var imagey = anchors[unit].posY
            // Only attempts to draw if the image has been loaded
            if (imagecache[card].complete) {
                ctx.drawImage(
                    imagecache[card],
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

function processapl(event_list) {
    event_list.forEach(event => {
        switch (event.action) {
            case "deal":
               gamestate[event.unit].push(event.card)
               drawstaticgamestate()
               break
            case "end":
                console.log(`${event.winner} won!`)
                break
            case "player_turn":
                console.log('Your turn!')
                break
            default:
                console.log(`Unknown action: ${event.action}`)
        }
    })
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
    gamestate.player.push(response)
    drawstaticgamestate()
})

ipcRenderer.on('getapl-response', (event, response) => {
    var actionlist = JSON.parse(response)
    processapl(actionlist)
})

ipcRenderer.on('stand-response', (event, response) => {
    hitbutton.classList.add("action-button-inactive")
    standbutton.classList.add("action-button-inactive")
})

var boardID = ipcRenderer.sendSync('getboardID')
ipcRenderer.send('request', `getapl/${boardID}`)