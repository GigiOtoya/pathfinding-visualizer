const canvas = document.getElementById("canvas");
const boundingRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const DOTTED_LINE = [10,10];
const STRAIGHT_LINE = [];
const DARK_PASTEL = "#1b1b1b"
const MINT = "#3BB3A0";

let onNode = false;
let dragging = false;
let addingEdge = false;
let drawingEdge = false;
let currNode = null;

let nodes = [];
let edgeSet = {};

const selectBtn = document.getElementById("select-btn");
const nodeBtn = document.getElementById("add-node-btn");
const edgeBtn = document.getElementById("add-edge-btn");

// ========================================================================================
// Event Listeners
// ========================================================================================
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

    const r = 20;
    let n1 = new Node(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100, r);
    nodes.push(n1);
    let n2 = new Node(CANVAS_WIDTH / 2 - 100, CANVAS_HEIGHT / 2, r);
    nodes.push(n2);
    let n3 = new Node(CANVAS_WIDTH / 2 + 100, CANVAS_HEIGHT / 2, r);
    nodes.push(n3);

    // insertNodeToGraph(n1);
    // insertNodeToGraph(n2);
    // insertNodeToGraph(n3);
    // addEdgeToGraph(n1,n2);
    // addEdgeToGraph(n1,n3);
    // addEdgeToGraph(n2,n3);

    addToEdgeSet(n1,n2);
    addToEdgeSet(n1,n3);
    addToEdgeSet(n2,n3);
    drawCanvas();
}
// ========================================================================================
// Graph Constructor
// ========================================================================================
function Graph() {
    this.adjacencyList = new Map();

    this.insertNodeToGraph = function (node) {
        this.adjacencyList.set(node, new Map());
    };

    this.addEdgeToGraph = function (source, neighbor) {
        const distance = getDistance(source, neighbor);
        // distance set for both nodes connected by edge
        this.adjacencyList.get(source).set(neighbor, distance);
        this.adjacencyList.get(neighbor).set(source, distance);
    };

    this.printGraph = function() {
        for (let node of this.adjacencyList.keys()) {
            const edges = this.adjacencyList.get(node);
            console.log(`${node.name}: ${edges}`);
        }
    };

}

// Graph functions
// function insertNodeToGraph(node) {
//     graph.set(node, new Map());
// }

// function addEdgeToGraph(node1, node2) {
//     const distance = getDistance(node1, node2);
//     // distance set for both nodes connected by edge
//     graph.get(node1).set(node2, distance);
//     graph.get(node2).set(node1, distance);
// }

// ========================================================================================
// Miscellaneous
// ========================================================================================
function getDistance(node1, node2) {
    const deltaX = node2.x - node1.x;
    const deltaY = node2.y - node1.y;
    return +Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)).toFixed(2);
}

function getMidpoint(node1, node2) {
    const x = Math.round((node1.x + node2.x) / 2);
    const y = Math.round((node1.y + node2.y) / 2);
    return {x: x, y: y};
}

// function updateEdgeDistance(node) {
//     // get map of nodes connected to node
//     const neighbors = graph.get(node);
//     // update distances
//     for (let neighbor of neighbors.keys()) {
//         addEdgeToGraph(node, neighbor);
//     }
// }

function addToEdgeSet(node1, node2) {
    const nodeValue1 = node1.name.charCodeAt();
    const nodeValue2 = node2.name.charCodeAt();
    const min = Math.min(nodeValue1, nodeValue2);

    let start;
    let end;

    if (nodeValue1 == min) {
        start = node1.name;
        end = node2.name;
    }
    else {
        start = node2.name;
        end = node1.name;
    }

    const key = `${start}-${end}`; 
    if(!edgeSet[key]) {
        edgeSet[key] = {node1, node2};
    }
}

function buildGraph() {
    // let visited = [];
    // let unvisited = [];

    const g = new Graph();
    for (let i=0; i<nodes.length; i++) {
        g.insertNodeToGraph(nodes[i]);
    }
    edges = Object.values(edgeSet);
    for (let i=0; i<edges.length; i++) {
        g.addEdgeToGraph(edges[i].node1, edges[i].node2);
    }
    return g;
}
// ========================================================================================
// Drawing Functions
// ========================================================================================
function drawCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = DARK_PASTEL;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawEdges();
    drawNodes();
}
function resetCanvas(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = DARK_PASTEL;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawNodes() {
    for (let i=0; i<nodes.length; i++) {
        ctx.beginPath();
        ctx.setLineDash(STRAIGHT_LINE);   
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].r, 0, Math.PI * 2);
        ctx.fillStyle = MINT;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(nodes[i].name, nodes[i].x, nodes[i].y);
    }   
}

function drawEdge(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.setLineDash(DOTTED_LINE);
    ctx.lineWidth = 2;
    ctx.strokeStyle = MINT;
    ctx.stroke();
}
function drawEdges() {
    let edges = Object.values(edgeSet);
    for (let i=0; i<edges.length; i++) {
        const node1 = edges[i].node1;
        const node2 = edges[i].node2;
        const midPoint = getMidpoint(node1, node2);
        const distance = getDistance(node1, node2);

        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.setLineDash(STRAIGHT_LINE);   
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.textBaseline = "ideographic";
        ctx.textAlign = "center";
        ctx.direction = "rtl"
        ctx.font = "12px sans-serif";
        ctx.fillText(`d = ${distance}`, midPoint.x, midPoint.y);
    }
}

// ========================================================================================
// Node Constructor
// ========================================================================================
function Node(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;    
    this.name = String.fromCharCode(65 + nodes.length);
    
    // this.drawNode = function() {
    //     ctx.beginPath();
    //     ctx.arc(this.x, this.y, this.r, 0, Math.PI *2);
    //     ctx.fillStyle = "lightsteelBlue";
    //     ctx.strokeStyle = "white";
    //     ctx.lineWidth = 3;
    //     ctx.fill();
    //     ctx.stroke();

    //     ctx.fillStyle = "black";
    //     ctx.textBaseline = "middle";
    //     ctx.textAlign = "center";
    //     ctx.font = "20px sans-serif";
    //     ctx.fillText(this.name, this.x, this.y);
    // };
};

// ========================================================================================
// Mouse Events
// ========================================================================================
function mouseMove(canvas, e) {
    let mousePosition = getMouseCoordinates(e);
    // console.log(currNode);

    // keep currNode from changing once we have it
    if (mouseOnNode(mousePosition.x, mousePosition.y)) {
        onNode = true;
        canvas.style.cursor = "grab";
    }
    else {
        onNode = false;
        count = 0;
        canvas.style.cursor = "default";
    }
    console.log(drawingEdge);
    if (addingEdge) {
        canvas.style.cursor = "crosshair";
        if (drawingEdge) {
            resetCanvas();
            drawEdge(currNode.x, currNode.y, mousePosition.x, mousePosition.y);
            drawEdges();
            drawNodes();
        }
        // if (drawingEdge) {
        //     const tempSet = structuredClone(edgeSet);
        //     let tempNode = new Node(mousePosition.x, mousePosition.y, 0);
        //     tempNode.name = '@';
        //     console.log(tempNode);
        //     addToEdgeSet(currNode, tempNode);
        //     drawCanvas();
        //     edgeSet = tempSet;
        // }
    }

    if (dragging) {
        currNode.x = mousePosition.x;
        currNode.y = mousePosition.y;
        nodes.forEach(node => console.log(`x: ${node.x}, y: ${node.y}`));
        // updateEdgeDistance(currNode);
        console.log(currNode);
        drawCanvas();
    }
};

// MOUSE CLICK
function mouseDown(e) {
    e.preventDefault();
    dragging = addingEdge? false : onNode;
    drawingEdge = dragging? false :onNode;
    // Handle dragging
    if (dragging) {
        const mousePosition = getMouseCoordinates(e);
        currNode = getNode(mousePosition.x, mousePosition.y);
    }

    // Handle New Edge
    if (addingEdge) {
        const mousePosition = getMouseCoordinates(e);
        currNode = getNode(mousePosition.x, mousePosition.y);
        console.log(currNode);
    }
    console.log(`dragging: ${dragging}, addingEdge: ${addingEdge}`);
};

// MOUSE CLICK RELEASE
function mouseUp(e) {
    e.preventDefault();
    dragging = false;
    drawingEdge = false;
    // Handle New Edge
    if (addingEdge) {
        const mousePosition = getMouseCoordinates(e);
        const neighbor = getNode(mousePosition.x, mousePosition.y);

        if (!currNode || !neighbor) {
            drawCanvas();
            return;
        }
        else if (currNode != neighbor) {
            addToEdgeSet(currNode, neighbor);
            drawCanvas();
        }
    }
    
    console.log(dragging);
};


// Get Mouse Coordinates
function getMouseCoordinates(e) {
    let mouseX = Math.max(0, Math.round(e.clientX - boundingRect.x));
    let mouseY = Math.round(e.clientY - boundingRect.y);
    return {x: mouseX, y: mouseY};
}

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

// ========================================================================================
// Button functions
// ========================================================================================
function select(e) {
    e.preventDefault();
    addingEdge = false;
}

function addNode(e) {
    e.preventDefault();
    addingEdge = false;
    let node = new Node(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 20);
    nodes.push(node);
    // graph.set(node, new Map());
    drawCanvas();
};

function addEdge(e) {
    e.preventDefault();
    addingEdge = true;
}

initialize();