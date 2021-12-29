const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');

var drawbutton = document.getElementById("draw-button")

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
    player: ['4C', '3H', '5D'],
    dealer: ['8C', 'QH', '5D'],
}

imagecache = { }

function drawstaticgamestate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // draws the hand of the player and dealer (or every entry in the gamestate object)
    for (const [unit, hand] of Object.entries(gamestate)) {
        // changes hand achor so that hand is always horizontally aligned
        gamestate[unit].forEach(function (card, index) {
            // hand starting point needs to be decalred inside the loop for some reason
            var handstartpoint = anchors[unit].posX - (hand.length * cardsize.width / 2)
            let cardimage
            if (card in imagecache) {
                cardimage = imagecache[card]
            } else {
                cardimage = new Image();
                cardimage.src = `../app/cards100/${card}.png`
                cardimage.onload = function() {
                    ctx.drawImage(
                        cardimage,
                        handstartpoint + (cardsize.width * index),
                        anchors[unit].posY,
                        cardsize.width,
                        cardsize.height,
                    )
                    imagecache[card] = cardimage
                }
            }
            ctx.drawImage(
                cardimage,
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
        deckimage.src = '../app/cards100/deck.png'
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

drawbutton.onclick = function () {
    gamestate.player.push("2C")
    drawstaticgamestate()
}

drawstaticgamestate()