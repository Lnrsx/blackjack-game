const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');

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
    dealer: ['4C', '3H', '5D'],
}

function drawgamestate(playeroffset = 0, dealeroffset = 0) {

    // draws the hand of the player and dealer (or every entry in the gamestate object)
    for (const [unit, hand] of Object.entries(gamestate)) {
        // changes hand achor so that hand is always horizontally aligned
        // offset of the hand can be added if a card is being animated towards the hand and needs room
        handstartpoint = anchors[unit].posX - ((hand.length + playeroffset) * cardsize.width / 2)
        gamestate.player.forEach(function (card, index) {
            var cardimage = new Image();
            cardimage.src = `../app/cards100/${card}.png`

            cardimage.onload = function() {
                ctx.drawImage(
                    cardimage,
                    handstartpoint + (cardsize.width * index),
                    anchors[unit].posY,
                    cardsize.width,
                    cardsize.height,
                )
            }
        })
    }

    // Draws deck image (will stay static during game)
    let deckimage = new Image();
    deckimage.src = '../app/cards100/deck.png'

    deckimage.onload = function () {
        ctx.drawImage(
            deckimage,
            anchors.deck.posX,
            anchors.deck.posY,
            cardsize.width,
            cardsize.height
        )
    }
}

drawgamestate()