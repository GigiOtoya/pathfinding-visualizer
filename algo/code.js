(function () {

console.log = function() {};
const canvas = document.getElementById("graph-canvas");
const boundingRect = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");

const DOTTED_LINE = [10,10];
const STRAIGHT_LINE = [];
const DARK_PASTEL = "#1b1b1b";
const CYAN = "#00FEFE";
const AZURE = "#336DFF";
const WHITE = "#FFFFFF";
const GREY = "#3c4043";
const GREEN = "#00FF00";

let onNode = false;
let dragging = false;
let addingEdge = false;
let drawingEdge = false;
let currNode = null;
let isRunning  = false;

let nodes = [];
let edgeSet = {};

const selectBtn = document.getElementById("select-btn");
const nodeBtn = document.getElementById("add-node-btn");
const edgeBtn = document.getElementById("add-edge-btn");
const runBtn = document.getElementById("run-btn");
const sourceSelect = document.getElementById("source-select");
const destinationSelect = document.getElementById("destination-select");
const randomBtn = document.getElementById("random-btn");
const clearBtn = document.getElementById("clear-btn");

// ========================================================================================
// Event Listeners
// ========================================================================================
window.addEventListener("resize", setSize)
selectBtn.addEventListener("click", select);
nodeBtn.addEventListener("click", addNode);
edgeBtn.addEventListener("click", addEdge);
runBtn.addEventListener("click", runAlgo);
randomBtn.addEventListener("click", randomGraph);
clearBtn.addEventListener("click", clearGraph);
canvas.addEventListener("mousemove", (e) => {
    let mouseEvent = e;
    mouseMove(canvas, mouseEvent);
});

canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);

// Functions
function initialize() {
    setSize();
    const r = 20;
    // A
    let n1 = new Node(canvas.width / 2, canvas.height / 2, r);
    nodes.push(n1);
    // B
    let n2 = new Node(canvas.width / 2 - 200, canvas.height / 2 - 75, r);
    nodes.push(n2);
    // C
    let n3 = new Node(canvas.width / 2 + 30, canvas.height / 2 - 150, r);
    nodes.push(n3);
    // D
    let n4 = new Node(canvas.width / 2 + 150, canvas.height / 2 - 20, r)
    nodes.push(n4);
    // E
    let n5 = new Node(canvas.width / 2 - 125, canvas.height / 2 + 100, r)
    nodes.push(n5);
    // F
    let n6 = new Node(canvas.width / 2 + 10, canvas.height / 2 + 150, r);
    nodes.push(n6);
    for (let i=0; i<nodes.length; i++) {
        addToDropDown(nodes[i].name, sourceSelect);
        addToDropDown(nodes[i].name, destinationSelect);
    }
    
    addToEdgeSet(n1,n2);
    addToEdgeSet(n1,n4);
    addToEdgeSet(n1,n6);
    addToEdgeSet(n2,n3);
    addToEdgeSet(n3,n5);
    addToEdgeSet(n2,n6);
    addToEdgeSet(n3,n4);
    addToEdgeSet(n4,n6);
    addToEdgeSet(n2,n3);

    drawCanvas();
}
// ========================================================================================
// Graph Constructor
// ========================================================================================
function Graph() {
    this.adjacencyList = new Map();
    this.nodes = [];
    this.edges = [];

    this.insertNodeToGraph = function (node) {
        this.adjacencyList.set(node, new Map());
        this.nodes.push(node);
    };

    this.addEdgeToGraph = function (source, neighbor) {
        // set by edge weight
        const edge = edgeSet[getEdgeKey(source, neighbor)]
        this.adjacencyList.get(source).set(neighbor, edge.weight)
        this.adjacencyList.get(neighbor).set(source, edge.weight)
        this.edges.push([edge.weight, source, neighbor]);
    };

    this.printGraph = function() {
        for (let node of this.adjacencyList.keys()) {
            const edges = this.adjacencyList.get(node);
            console.log(`${node.name}: ${edges}`);
        }
    };

}

// ========================================================================================
// Miscellaneous
// ========================================================================================
function setSize() {
    const div = document.getElementById("canvas-wrapper");
    canvas.width = div.clientWidth;
    canvas.height = div.clientHeight;
    drawCanvas();
}

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

function addToEdgeSet(node1, node2) {
    const key = getEdgeKey(node1, node2);

    if(!edgeSet[key]) {
        edgeSet[key] = {node1, node2, weight: setWeight()};
    }
}

function getEdgeKey(node1, node2) {
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
    return `${start}-${end}`; 
}

function setWeight() {
    if (f == 0 || f == 1) return randomInt(1,10);
    if (f == 2 || f == 3 || f == 4) return 1;
    if (f == 5 || f == 6) return randomInt(1,10);
}

function adjustWeights() {
    for (let edge of Object.values(edgeSet)) {
        edge.weight = setWeight();
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetAll() {
    edgeSet = {};
    nodes.length = 0;
    sourceSelect.length = 0;
    destinationSelect.length = 0;
}

// ========================================================================================
// Drawing Functions
// ========================================================================================
function drawCanvas() {
    resetCanvas();
    drawEdges();
    drawNodes();
}

function resetCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = DARK_PASTEL;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawNodes() {
    for (let i=0; i<nodes.length; i++) {
        drawNode(nodes[i]);
    }   
}

function drawNode(node, fc = GREY, sc = WHITE, lw = 3) {
    ctx.beginPath();
    ctx.setLineDash(STRAIGHT_LINE);
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fillStyle = fc;
    ctx.strokeStyle = sc;
    ctx.lineWidth = lw;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(node.name, node.x, node.y);
}

function drawEdge(p1, p2, lc=WHITE, lw=2, ls = STRAIGHT_LINE) {
    if (p1 == null || p2 == null) {
        return;
    }
    ctx.beginPath();
    if (addingEdge) {
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
    }
    else {
        const v = getVector(p1, p2);
        ctx.moveTo(v.p1.x, v.p1.y);
        ctx.lineTo(v.p2.x, v.p2.y);
    }

    ctx.setLineDash(ls);
    ctx.lineWidth = lw;
    ctx.strokeStyle = lc;
    ctx.stroke();
}

function drawEdges() {
    let edges = Object.values(edgeSet);
    for (let i=0; i<edges.length; i++) {
        const node1 = edges[i].node1;
        const node2 = edges[i].node2;
        drawEdge(node1, node2);
        annotateEdge(node1, node2);
    }
}

function getVector(p1, p2) {
    const deltaX = p1.x - p2.x;
    const deltaY = p1.y - p2.y;

    const length = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    const normal = {x: deltaX/length, y: deltaY/length}; 
    const p_1 = {
        x: p1.x - ((p1.r+2) * normal.x),
        y: p1.y - ((p1.r+2) * normal.y)
    };

    const p_2 = {
        x: p2.x + ((p2.r+2)* normal.x),
        y: p2.y + ((p2.r+2) * normal.y)
    };
    return {p1: p_1, p2: p_2};
}

function annotateEdge(node1, node2) {
    const midPoint = getMidpoint(node1, node2);
    // const distance = getDistance(node1, node2);
    const edge = edgeSet[getEdgeKey(node1, node2)]
    let dx = node2.x - node1.x;
    let dy = node2.y - node1.y;

    ctx.fillStyle = CYAN;
    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";
    ctx.font = "16px sans-serif";

    ctx.save();
    // get angle to where midpoint would be if translated.
    let angle = Math.atan2(dy, dx);
    // fix text orientation
    if (angle < -Math.PI/2 || angle > Math.PI/2) {
        angle -= Math.PI;
    }

    ctx.translate(midPoint.x, midPoint.y);
    ctx.rotate(angle);
    ctx.fillText(`w = ${edge.weight}`, 0, 0);
    ctx.restore();
}

// ========================================================================================
// Node Constructor
// ========================================================================================
function Node(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;    
    this.name = String.fromCharCode(65 + nodes.length);
};

// ========================================================================================
// Mouse Events
// ========================================================================================
function mouseMove(canvas, e) {
    let mousePosition = getMouseCoordinates(e);
    // keep currNode from changing once we have it
    if (!isRunning) {
        onNode = mouseOnNode(mousePosition.x, mousePosition.y);
    }

    if (onNode) {
        canvas.style.cursor = "grab"
    }
    else {
        canvas.style.cursor = "default";
    }

    if (addingEdge) {
        canvas.style.cursor = "crosshair";
        if (drawingEdge) {
            resetCanvas();
            drawEdge(currNode, mousePosition, CYAN, 2, DOTTED_LINE);
            drawEdges();
            drawNodes();
        }
    }

    if (dragging) {
        canvas.style.cursor = "grabbing";
        currNode.x = mousePosition.x;
        currNode.y = mousePosition.y;
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
    }
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
    let node = new Node(canvas.width / 2, canvas.height / 2, 20);
    nodes.push(node);

    addToDropDown(node.name, sourceSelect);
    addToDropDown(node.name, destinationSelect);
    drawCanvas();
};

function addToDropDown(name, dropDown) {
    const newOption = document.createElement("option");
    const optionText = document.createTextNode(name);
    newOption.setAttribute("value", name);
    newOption.appendChild(optionText);
    dropDown.appendChild(newOption);
}
function addEdge(e) {
    e.preventDefault();
    addingEdge = true;
}

function buildGraph() {
    const g = new Graph();
    for (let i=0; i<nodes.length; i++) {
        g.insertNodeToGraph(nodes[i]);
    }
    const edges = Object.values(edgeSet);
    for (let i=0; i<edges.length; i++) {
        g.addEdgeToGraph(edges[i].node1, edges[i].node2);
    }
    return g;
}

let f = 0;
const navItems = document.getElementById("nav-items").getElementsByTagName("li");
for(item of navItems) {
    item.addEventListener("click", function() {
        if (!isRunning) {
            for (item of navItems) {
                item.classList = "";
            }
            this.classList.add("active");
            f = this.value;
            adjustWeights();
            drawCanvas();
        }
    });
}

function toggleNav() {
    for (item of navItems) {
        if (isRunning) {
            item.style.color = "rgb(128, 128, 128";
        }
        else {
            item.style.color = WHITE;
        }
    }
}

function disableAll() {
    isRunning = true;
    dragging = false;
    addingEdge = false;
    nodeBtn.disabled = true;
    edgeBtn.disabled = true;
    runBtn.disabled = true;
    randomBtn.disabled = true;
    clearBtn.disabled = true;
    toggleNav();
}
function enableAll() {
    isRunning = false;
    nodeBtn.disabled = false;
    edgeBtn.disabled = false;
    runBtn.disabled = false;
    randomBtn.disabled = false;
    clearBtn.disabled = false;
    toggleNav();
}

async function runAlgo(e) {
    e.preventDefault();
    if (nodes.length == 0) return;
    disableAll();
    
    g = buildGraph();
    
    const source = nodes[sourceSelect.value.charCodeAt()-65];
    const destination = nodes[destinationSelect.value.charCodeAt()-65];
    drawCanvas();
    switch(f) {
        case 0 : await dijkstra(g.adjacencyList, source, destination);
        break;
        case 1 : await floydWarshall(g);
        break;
        case 2 : await depthFirstSearchr(g.adjacencyList, source ,destination);
        break;
        case 3 : await depthFirstSearchi(g.adjacencyList, source, destination);
        break;
        case 4 : await breadthFirstSearch(g.adjacencyList, source, destination);
        break;
        case 5 : await prim(g.adjacencyList, source);
        break;
        case 6 : await kruskal(g);
        break;
    }
    enableAll();
}

function sliderValue() {
    const factor = document.getElementById("speedcontrol").value;
    const speed = (2000 - factor * 500);
    return speed==0? 100 : speed;
}

function randomGraph(e) {
    e.preventDefault();
    resetAll();

    const n = 5;
    const degree = new Array(n).fill(0);
    const maxDegree = degree.map(x => randomInt(x+1, n-1));
    const edgeCount = maxDegree.reduce((prev, cur) => prev+cur);

    while (nodes.length < n) {
        const node = new Node(
            randomInt(20, canvas.width-20),
            randomInt(20, canvas.height-20),
            20
        );

        let overlapping = false;

        for (let j = 0; j < nodes.length; j++) {
            if (getDistance(node, nodes[j]) < (node.r + nodes[j].r)*3) {
                overlapping = true;
                break;
            }
        }
        if (!overlapping) {
            nodes.push(node);
            addToDropDown(node.name, sourceSelect);
            addToDropDown(node.name, destinationSelect);
        }
    }

    for (let i = 0; i < nodes.length; i++) {
        const start = i
        while (degree[i] < maxDegree[i]) {

            let end = randomInt(0, nodes.length-1);

            if (start == end) {
                end = randomInt(0, nodes.length-1);
            }
            // else if (degree[end] == maxDegree[end]) {
            //     end = randomInt(0, nodes.length-1);
            // }
            else if (Object.hasOwn(edgeSet, getEdgeKey(nodes[start], nodes[end]))) {
                end = randomInt(0, nodes.length-1);
            }
            else {
                addToEdgeSet(nodes[start], nodes[end]);
                degree[start]++;
                degree[end]++;
            }
        }
    }
    drawCanvas();
}

function clearGraph(e) {
    e.preventDefault();
    resetCanvas();
    resetAll();
}
// ========================================================================================
// Algorithms
// ========================================================================================
async function dijkstra(graph, source, destination) {
    const visited = new Set();
    const distances = new Map();
    const paths = new Map();
    const heapQ = new MinHeap();

    for (let node of graph.keys()) {
        distances.set(node, Infinity);
    }
    distances.set(source, 0);
    paths.set(source, null);
    heapQ.heapPush([0, source]);


    while (heapQ.minHeap.length) {
        // get node with least total distance
        const [curWeight, curNode] = heapQ.heapPop();
        if (!visited.has(curNode)) {
            visited.add(curNode);

            drawNode(curNode, GREY, AZURE, 4);
            await delay(sliderValue());

            for (let [neighbor, weight] of graph.get(curNode)) {
                const nextWeight = curWeight + weight;
                if (!visited.has(neighbor) && nextWeight < distances.get(neighbor)) {
                    distances.set(neighbor, nextWeight);
                    paths.set(neighbor, curNode);
                    heapQ.heapPush([nextWeight, neighbor]);
                    drawEdge(curNode, neighbor, AZURE, 4);
                    await delay(sliderValue());
                }
            }
        }
    }
    pathTrace(paths, source, destination);
}

const delay = (ms) => new Promise(function(resolve) {
    setTimeout(() => {resolve()}, ms);
});

function pathTrace(paths, start, end) {
    while (end) {
        let previous = paths.get(end);
        if (previous) {
            drawEdge(end, previous, GREEN, 4);
        }
        drawNode(end, GREY, GREEN, 4);
        end = previous;
    }
}

function MinHeap() {
    this.minHeap = [];

    this.heapPush = function(item) {
        this.minHeap.push(item);
        this.bubbleUp(this.minHeap.length - 1);
    }
    
    this.bubbleUp = function(index) {
        const parent = Math.floor((index-1) / 2);
        if (index > 0 && this.minHeap[index][0] < this.minHeap[parent][0]) {
            const temp = this.minHeap[parent];
            this.minHeap[parent] = this.minHeap[index];
            this.minHeap[index] = temp;
            this.bubbleUp(parent);
        }
    }

    this.heapPop = function() {
        if (this.minHeap.length > 0) {
            const min = this.minHeap[0];
            this.minHeap[0] = this.minHeap[this.minHeap.length - 1];
            this.minHeap.length -= 1;
            this.bubbleDown(0);
            return min;
        }
    }

    this.bubbleDown = function(index) {
        let smallest = index;
        let left = 2*index+1;
        let right = 2*index+2;

        if (left < this.minHeap.length && this.minHeap[smallest][0] > this.minHeap[left][0]) {
            smallest = left;
        }

        if (right < this.minHeap.length && this.minHeap[smallest][0] > this.minHeap[right][0]) {
            smallest = right;
        }

        if (smallest != index) {
            const temp = this.minHeap[index];
            this.minHeap[index] = this.minHeap[smallest];
            this.minHeap[smallest] = temp;

            this.bubbleDown(smallest);
        }
    }

    this.minHeapify = function(arr, index) {
        let smallest = index;
        let left = 2*index+1;
        let right = 2*index+2;

        if (left < arr.length && arr[left][0] < arr[smallest][0]) {
            smallest = left;
        }

        if (right < arr.length && arr[right][0] < arr[smallest][0]) {
            smallest = right;
        }

        if (smallest != index) {
            let temp = arr[index];
            arr[index] = arr[smallest];
            arr[smallest] = temp;

            this.minHeapify(arr, smallest);
        }
    }

    this.buildHeap = function(arr) {
        this.minHeap = arr;
        for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
            this.minHeapify(this.minHeap, i);
        }
    }
}

async function floydWarshall(G) {
    const g = G.adjacencyList;
    const distances = [];
    const prev = [];
    // initialize
    for (let i = 0; i < [...g.keys()].length; i++) {
        distances[i] = [];
        prev[i] = [];
        for (let j = 0; j < [...g.keys()].length; j++) {
            distances[i][j] = (i == j)? 0 : Infinity;
            prev[i][j] = (i == j)? i: null;
        }
    }
    // fill edge weights
    for (let U of [...g.keys()]) {
        for (let [V , w] of g.get(U)) {
            const u = U.name.charCodeAt()-65;
            const v = V.name.charCodeAt()-65;
            distances[u][v] = w;
            prev[u][v] = u;
        }
    }

    for (let k = 0; k < [...g.keys()].length; k++) {
        drawNode(G.nodes[k], AZURE);

        for (let i = 0; i < [...g.keys()].length; i++) {
            if (i == k) {
                continue;
            }
            for (let j = 0; j < [...g.keys()].length; j++) {
                if (i == j || j == k) {
                    continue;
                }
                // highlight current edge
                drawEdge(G.nodes[i], G.nodes[j], "red", 4, DOTTED_LINE);
                drawNode(G.nodes[i], GREY, "red", 4);
                drawNode(G.nodes[j], GREY, "red", 4);
                await delay(sliderValue());

                if (distances[i][j] > distances[i][k] + distances[k][j]) {
                    distances[i][j] = distances[i][k] + distances[k][j];
                    prev[i][j] = prev[k][j];
                    trace(prev, G.nodes, i, j);
                    await delay(sliderValue()); 
                }
                drawCanvas();
                drawNode(G.nodes[k], AZURE);
            }
            
        }
    drawCanvas();
    }
    console.log(prev);
}

function trace(prev, nodes, i, j) {
    let u = i;
    let v = j;
    // v != prev[u]prev[u][v]
    while (u != v &&(prev[u][v] != null)) {
        console.log(`u: ${u}, v: ${v}`);
        drawEdge(nodes[v], nodes[prev[u][v]], GREEN, 4);
        drawNode(nodes[v], GREY, GREEN, 4);
        drawNode(nodes[prev[u][v]], GREY, GREEN, 4);
        if (v == prev[u][prev[u][v]]) {
            break;
        }
        else {
            v = prev[u][v];
        }
    }
}

async function depthFirstSearchi(g, start, end) {
    const stack = [start];
    const visited = new Set([start]);
    const paths = new Map([[start, null]]);

    while (stack.length) {
        const node = stack.pop();
        drawNode(node, GREY, AZURE, 4);
        await delay(sliderValue());

        for (neighbor of [...g.get(node).keys()]) {
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
                visited.add(neighbor);
                paths.set(neighbor, node);
                drawEdge(node, neighbor, AZURE, 4);
                await delay(sliderValue());
            }
        }
    }
    pathTrace(paths, start, end);
}


async function depthFirstSearchr(g, start, end) {
    const visited = new Set();
    const paths = new Map([[start, null]]);

    console.log("dfs:");
    async function dfs(node) {
        visited.add(node);
        drawNode(node, GREY, AZURE, 4);
        console.log(node);
        await delay(sliderValue());

        for (let neighbor of [...g.get(node).keys()]) {
            if (!visited.has(neighbor)) {
                drawEdge(node, neighbor, AZURE, 4);
                paths.set(neighbor, node);
                await dfs(neighbor);
            }
        }
        return;
    }
    await dfs(start);
    pathTrace(paths, start, end);
}

async function breadthFirstSearch(g, start, end) {
    const Q = [start];
    const visited = new Set([start]);
    const paths = new Map([[start, null]]);

    while (Q.length) {
        const node = Q.shift(0);
        drawNode(node, GREY, AZURE, 4);
        await delay(sliderValue());

        for (neighbor of [...g.get(node).keys()]) {
            if (!visited.has(neighbor)) {
                Q.push(neighbor);
                visited.add(neighbor);
                paths.set(neighbor, node);
                drawEdge(node, neighbor, AZURE, 4);
                await delay(sliderValue());
            }
        }
    }
    pathTrace(paths, start, end);
}

async function prim(g, start) {
    const visited = new Set();
    const q = new MinHeap();
    const prev = new Map();
    prev.set(start, {p: null, w: 0});
    q.heapPush([0, start]);

    let cost = 0;
    while (q.minHeap.length) {
        const [w, u] = q.heapPop();
        
        if (visited.has(u)) {
            continue;
        }

        drawNode(u, GREY, GREEN, 4);
        await delay(sliderValue());
        drawEdge(u, prev.get(u).p, GREEN, 4);
        await delay(sliderValue()); 
               
        for (let [v, w] of [...g.get(u)]) {
            if (!visited.has(v)) {
                q.heapPush([w, v]);
                if (!prev.has(v)) {
                    prev.set(v, {p: u, w: w});
                }
                else if (w < prev.get(v).w) {
                    prev.set(v, {p: u, w: w});

                }
            }
        }
        cost += w;
        visited.add(u);
    }
    console.log(cost);
}

async function kruskal(g) {
    function find(node) {
        let u = node.name.charCodeAt()-65;
        while (t[u] != u) {
            u = t[u];
        }
        return u;
    }

    function union(u, v) {
        let x = find(u);
        let y = find(v);
        t[y] = x;
    }

    let cost = 0;
    const q = new MinHeap();
    q.buildHeap(g.edges);
    // tree for each node
    const t = [];
    for (let i = 0; i < g.nodes.length; i++) {
        t[i] = i;
    }


    while (q.minHeap.length) {
        // get smallest edge by weight
        const [w, u, v] = q.heapPop();

        if (find(u) == find(v)) {
            drawEdge(u, v, 'red', 4);
            await delay(sliderValue());
            drawEdge(u, v, DARK_PASTEL, 6);
            drawEdge(u, v);
            continue;
        }
        cost += w;
        union(u, v);

        drawEdge(u, v, GREEN, 4);
        await delay(sliderValue());
        drawNode(u, GREY, GREEN, 4);
        drawNode(v, GREY, GREEN, 4);
        await delay(sliderValue());
    }
    console.log(cost);
}

initialize();
})();