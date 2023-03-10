const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let draggableNode;
let draggable = false;
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
    mouseMove(canvas, mouseEvent);
});

canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);

// Functions
function initialize() {// initial nodes
    const r = 20;
    let n1 = new Node(canvas.width / 2, canvas.height / 2 - 100, r);
    let n2 = new Node(canvas.width / 2 - 100, canvas.height / 2, r);
    let n3 = new Node(canvas.width / 2 + 100, canvas.height / 2, r);
    nodes.push(n1,n2,n3);
    drawCanvas();
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1b1b1b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(node => node.drawNode());
}

// Circle constructor
function Node(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    
    this.drawNode = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI *2);
        ctx.fillStyle = "lightsteelBlue";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
    };
};

function mouseMove(canvas, e) {
    let boundingRect = canvas.getBoundingClientRect();
    let x2 = Math.max(0, Math.round(e.clientX - boundingRect.x));
    let y2 = Math.round(e.clientY - boundingRect.y);

    // draggableNode = nodes.find(node => {
    //     let x1 = node.x;
    //     let y1 = node.y;
    //     let d = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
    //     return d <= node.r;
    // });

    for (let i=0; i<nodes.length; i++) {
        let x1 = nodes[i].x;
        let y1 = nodes[i].y;
        let d = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);

        if (d <= nodes[i].r) {
            draggableNode = nodes[i];
            break;
        }
    }
    canvas.style.cursor = draggableNode? "grab" : "default";

    if (draggable) {
        draggableNode.x = Math.max(0, Math.round(e.clientX - boundingRect.x));
        draggableNode.y = Math.round(e.clientY - boundingRect.y);
        nodes.forEach(node => console.log(`x: ${node.x}, y: ${node.y}`));
        console.log(draggableNode);
        drawCanvas();
    };
};

function mouseDown(e) {
    e.preventDefault();
    draggable = mouseOnNode()? true : false;
    console.log(draggable);
};

function mouseUp(e) {
    e.preventDefault();
    draggable = false;
    console.log(draggable);
};

function mouseOnNode() {
    if (draggableNode) {
        return true;
    }
    else {
        return false;
    }
};

// Button functions
function addNode(e) {
    e.preventDefault();
    let node = new Node(canvas.width / 2, canvas.height / 2, 30);
    nodes.push(node);
    node.drawNode();
};

initialize();