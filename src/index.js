const { ipcRenderer } = require('electron')

// Deck slider updater
var deckslider = document.getElementById("deck-slider")
var deckslideroutput = document.getElementById("deck-count-value")
var gamestartbutton = document.getElementById("start-button")

deckslider.oninput = function() {
    deckslideroutput.innerHTML = this.value
}

gamestartbutton.onclick = function () {
    ipcRenderer.send('request', `start/${deckslideroutput.innerHTML}`)
}

ipcRenderer.on('start-response', (event, arg) => {
    window.location.href = "../app/game.html"
    ipcRenderer.send('setboardID', arg)
})