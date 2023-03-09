const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;


function drawCanvas() {
    ctx.fillStyle = "#1b1b1b";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);
}

function drawNode() {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2, false);
    ctx.fillStyle = "lightsteelblue";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();
}

drawCanvas();
drawNode();