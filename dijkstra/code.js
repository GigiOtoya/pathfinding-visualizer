const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;

let nodes = [];
let visited = [];
let unvisited = [];

nodeBtn = document.getElementById("add-node-btn");
edgeBtn = document.getElementById("add-edge-btn");

// Event Listeners
nodeBtn.addEventListener("click", addNode);
// document.addEventListener("mousemove", onNode);
canvas.addEventListener("mousemove", (e) => {
    let mouseEvent = e;
    getMousePos(canvas, mouseEvent);
});

function drawCanvas() {
    ctx.fillStyle = "#1b1b1b";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);

    // initial nodes
    let n1 = new Node(canvas.width / 2, canvas.height / 2 - 100, 30);
    let n2 = new Node(canvas.width / 2 - 100, canvas.height / 2, 30);
    let n3 = new Node(canvas.width / 2 + 100, canvas.height / 2, 30);
    nodes.push(n1,n2,n3);
    nodes.forEach(node => node.drawNode());
}

// Circle constructorjh
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

// function onNode(e) {
//     let x = e.clientX;
//     let y = e.clientY;
//     console.log(e.target);
// }

function getMousePos(canvas, e) {
    let boundingRect = canvas.getBoundingClientRect();
    let x2 = Math.max(0, Math.round(e.clientX - boundingRect.x));
    let y2 = Math.round(e.clientY - boundingRect.y);
    console.log(`x: ${x2}, y: ${y2}`);
    
    nodes.forEach(node => {
        let x1 = node.x;
        let y1 = node.y;
        let d = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);

        if (d <= node.r) {
            console.log("true")
        }
        else {
            console.log("false");
        }
        
    });
};

// Button functions
function addNode(e) {
    e.preventDefault();
    let node = new Node(canvas.width / 2, canvas.height / 2, 30);
    node.drawNode();
};

drawCanvas();