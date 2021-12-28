// Player slider updater
var playerSlider = document.getElementById("player-slider")
var playerSliderOutput = document.getElementById("player-count-value")

playerSlider.oninput = function() {
    playerSliderOutput.innerHTML = this.value
}

// Deck slider updater
var deckSlider = document.getElementById("deck-slider")
var deckSliderOutput = document.getElementById("deck-count-value")

deckSlider.oninput = function() {
    deckSliderOutput.innerHTML = this.value
}