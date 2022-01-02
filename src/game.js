const { ipcRenderer } = require('electron')

const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');

var drawbutton = document.getElementById("draw-button")
var getaplbutton = document.getElementById("get-apl")

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
            ctx.drawImage(
                imagecache[card],
                handstartpoint + (cardsize.width * index),
                anchors[unit].posY,
                cardsize.width,
                cardsize.height,
            )
        })
    }
 
    // Draws deck image (will stay static during game)
    if ('deckimage' in imagecache) {
        deckimage = imagecache['deckimage']
    } else {
        deckimage = new Image();
        deckimage.src = '../assets/cards100/deck.png'
        deckimage.onload = function () {
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

drawbutton.onclick = function () {
    var boardID = ipcRenderer.sendSync('getboardID')
    ipcRenderer.send('request', `hit/${boardID}`)
}

ipcRenderer.on('hit-response', (event, response) => {
    gamestate.player.push(response)
    drawstaticgamestate()
})

 ipcRenderer.on('getapl-response', (event, response) => {
    var actionlist = JSON.parse(response)
    processapl(actionlist)
})

var boardID = ipcRenderer.sendSync('getboardID')
ipcRenderer.send('request', `getapl/${boardID}`)