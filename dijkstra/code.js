const canvas = document.getElementById("canvas");
const boundingRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

let onNode = false;
let dragging = false;
let currNode = null;
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
    this.name = String.fromCharCode(65 + nodes.length);
    
    this.drawNode = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI *2);
        ctx.fillStyle = "lightsteelBlue";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "20px sans-serif";
        ctx.fillText(this.name, this.x, this.y);
    };
};

function mouseMove(canvas, e) {
    let mouseX = Math.max(0, Math.round(e.clientX - boundingRect.x));
    let mouseY = Math.round(e.clientY - boundingRect.y);
    
    // keep currNode from changing once we have it
    if (mouseOnNode(mouseX, mouseY)) {
        onNode = true;
        canvas.style.cursor = "grab";
    }
    else {
        onNode = false;
        canvas.style.cursor = "default";
    }

    if (dragging) {
        currNode.x = mouseX;
        currNode.y = mouseY;
        nodes.forEach(node => console.log(`x: ${node.x}, y: ${node.y}`));
        console.log(currNode);
        drawCanvas();
    }
};

function mouseDown(e) {
    e.preventDefault();
    dragging = onNode;
    let mouseX = Math.max(0, Math.round(e.clientX - boundingRect.x));
    let mouseY = Math.round(e.clientY - boundingRect.y);
    currNode = getNode(mouseX, mouseY);
    console.log(dragging);
};

function mouseUp(e) {
    e.preventDefault();
    dragging = false;
    console.log(dragging);
};

function mouseOnNode(x2, y2) {
    for (let i=0; i<nodes.length; i++) {
        let x1 = nodes[i].x;
        let y1 = nodes[i].y;
        let d = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);

        if (d <= nodes[i].r) {
            return true
        }
    }
    return false;
}

function getNode(x2, y2) {
    for (let i=0; i<nodes.length; i++) {
        let x1 = nodes[i].x;
        let y1 = nodes[i].y;
        let d = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);

        if (d <= nodes[i].r) {
            return nodes[i];
        }
    }
    return null;
};

// Button functions
function addNode(e) {
    e.preventDefault();
    let node = new Node(canvas.width / 2, canvas.height / 2, 20);
    nodes.push(node);
    node.drawNode();
};

initialize();