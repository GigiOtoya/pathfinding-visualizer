const canvas = document.getElementById("canvas");
const boundingRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

let graph;
let onNode = false;
let dragging = false;
let addingEdge = false;
let currNode = null;

let nodes = [];
let edges = [];

selectBtn = document.getElementById("select-btn");
nodeBtn = document.getElementById("add-node-btn");
edgeBtn = document.getElementById("add-edge-btn");

// Event Listeners
selectBtn.addEventListener("click", select);
nodeBtn.addEventListener("click", addNode);
edgeBtn.addEventListener("click", addEdge);
canvas.addEventListener("mousemove", (e) => {
    let mouseEvent = e;
    mouseMove(canvas, mouseEvent);
});

canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);

// Functions
function initialize() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    graph = new Map();

    const r = 20;
    let n1 = new Node(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100, r);
    nodes.push(n1);
    let n2 = new Node(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2, r);
    nodes.push(n2);
    let n3 = new Node(CANVAS_WIDTH / 2 + 100, CANVAS_HEIGHT / 2, r);
    nodes.push(n3);

    insertNodeToGraph(n1);
    insertNodeToGraph(n2);
    insertNodeToGraph(n3);
    addEdgeToGraph(n1,n2);
    addEdgeToGraph(n1,n3);
    addEdgeToGraph(n2,n3);
    drawCanvas();
}

// Graph functions
function insertNodeToGraph(node) {
    graph.set(node, new Map());
}

function addEdgeToGraph(node1, node2) {
    const distance = getDistance(node1, node2);
    // distance set for both nodes connected by edge
    graph.get(node1).set(node2, distance);
    graph.get(node2).set(node1, distance);
}

function getDistance(node1, node2) {
    const deltaX = node2.x - node1.x;
    const deltaY = node2.y - node2.y;
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

function updateEdgeDistance(node) {
    // get map of nodes connected to node
    const neighbors = graph.get(node);
    // update distances
    for (let neighbor of neighbors.keys()) {
        addEdgeToGraph(node, neighbor);
    }
}

function drawCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#1b1b1b";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    drawEdges();
    nodes.forEach(node => node.drawNode());
}

function drawEdges() {
    for (let node of graph.keys()) {
        neighbors = graph.get(node);
        for (let neighbor of neighbors.keys()) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(neighbor.x, neighbor.y);
            ctx.stroke();
        }
    }
}

// Node constructor
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

    if (addingEdge) {
        canvas.style.cursor = "crosshair";
    }

    if (dragging) {
        currNode.x = mouseX;
        currNode.y = mouseY;
        nodes.forEach(node => console.log(`x: ${node.x}, y: ${node.y}`));
        updateEdgeDistance(currNode);
        console.log(currNode);
        drawCanvas();
    }
};

// MOUSE CLICK
function mouseDown(e) {
    e.preventDefault();
    dragging = addingEdge? false : onNode;
    
    let mouseX = Math.max(0, Math.round(e.clientX - boundingRect.x));
    let mouseY = Math.round(e.clientY - boundingRect.y);
    currNode = getNode(mouseX, mouseY);

    if (addingEdge) {
        edges.push(currNode);
    }
    console.log(`dragging: ${dragging}, addingEdge: ${addingEdge}`);
};

// MOUSE CLICK RELEASE
function mouseUp(e) {
    e.preventDefault();
    if (addingEdge) {
        let mouseX = Math.max(0, Math.round(e.clientX - boundingRect.x));
        let mouseY = Math.round(e.clientY - boundingRect.y);
        currNode = getNode(mouseX, mouseY);
        edges.push(currNode);
        console.log("edge added");
    }
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
function select(e) {
    e.preventDefault();
    addingEdge = false;
}

function addNode(e) {
    e.preventDefault();
    let node = new Node(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 20);
    nodes.push(node);
    graph.set(node, new Map());
    node.drawNode();
};

function addEdge(e) {
    e.preventDefault();
    addingEdge = true;   
}

function createEdge(node1, node2) {
    if (node1 && node2) {
        console.log("true");
    }
}
// Graph
function buildGraph() {
    let visited = [];
    let unvisited = [];

}
initialize();