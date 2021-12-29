// Deck slider updater
var deckSlider = document.getElementById("deck-slider")
var deckSliderOutput = document.getElementById("deck-count-value")

deckSlider.oninput = function() {
    deckSliderOutput.innerHTML = this.value
}