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

// changes hand achor so that hand is always horizontally aligned
playerhandstartpoint = anchors.player.posX - (gamestate.player.length * cardsize.width / 2)
gamestate.player.forEach(function (card, index) {
    var cardimage = new Image();
    cardimage.src = `../app/cards100/${card}.png`

    cardimage.onload = function() {
        ctx.drawImage(
            cardimage,
            playerhandstartpoint + (cardsize.width * index),
            anchors.player.posY,
            cardsize.width,
            cardsize.height,
        )
    }
})

dealerhandstartpoint = anchors.dealer.posX - (gamestate.dealer.length * cardsize.width / 2)
gamestate.dealer.forEach(function (card, index) {
    var cardimage = new Image();
    cardimage.src = `../app/cards100/${card}.png`

    cardimage.onload = function() {
        ctx.drawImage(
            cardimage,
            dealerhandstartpoint + (cardsize.width * index),
            anchors.dealer.posY,
            cardsize.width,
            cardsize.height,
        )
    }
})