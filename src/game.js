const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let image = new Image();
image.src = '../app/cards100/2C.png'

image.onload = function() {
    ctx.drawImage(image, 0, 0, 82, 125);
}