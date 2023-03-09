const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;

let visited = [];
let unvisited = [];

nodeBtn = document.getElementById("add-node-btn");
edgeBtn = document.getElementById("add-edge-btn");

// Event Listeners
nodeBtn.addEventListener("click", addNode);


function drawCanvas() {
    ctx.fillStyle = "#1b1b1b";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);
}

// Circle constructor
function Node(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    
    this.drawNode = function() {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI *2);
        ctx.fillStyle = "lightsteelBlue";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
    };
};

// Button functions
function addNode(e) {
    e.preventDefault();
    let node = new Node(canvas.width / 2, canvas.height / 2, 50);
    node.drawNode();
};

drawCanvas();