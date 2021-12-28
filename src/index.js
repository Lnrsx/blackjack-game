var slider = document.getElementById("player-slider")
var output = document.getElementById("player-count-value")

slider.oninput = function() {
    output.innerHTML = this.value
}