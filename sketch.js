let [gridW, gridH, gridS] = [80, 80, 10];
let grid, ant;
let slider;
let speed = 20;
let steps = 0;
let dir = -gridW;
let directions = [-gridW, 1, gridW, -1];
let settings = {};
function setup() {
    createCanvas(gridW * gridS + 450, gridH * gridS);
    frameRate(speed);
    grid = Array(gridW * gridH).fill(1);
    ant = Math.round(gridH / 2) * gridW + Math.round(gridW / 2) - 1;
    slider = createSlider(5, 100, 20);
    slider.position(gridW * gridS + 30, 200);
    slider.style("width", "250px");
}

function moveAnt() {
    grid[ant] = grid[ant] === 1 ? 0 : 1;
    if (grid[ant] === 0) {
        //white square
        dir = directions[directions.indexOf(dir) + 1];
        if (!dir) dir = directions[0];
    } else {
        //black square
        dir = directions[directions.indexOf(dir) - 1];
        if (!dir) dir = directions[3];
    }
    ant += dir;
    steps++;
}

function draw() {
    background("#ebebeb");
    if (speed !== slider.value()) {
        speed = Math.round(slider.value());
        if (speed > 50) frameRate(50);
        else frameRate(speed);
    }
    for (let i = 0; i < gridH; i++) {
        for (let j = 0; j < gridW; j++) {
            let index = i * gridW + j;
            if (ant === index) fill("red");
            else if (grid[index] === 1) fill(255);
            else fill(0);
            rect(j * gridS, i * gridS, gridS, gridS);
        }
    }

    for (let i = 0; i < Math.floor(speed / 50) + 1; i++) moveAnt();

    fill(0);
    textSize(40);
    textStyle(BOLD);
    text("Langton's Ant", gridW * gridS + 15, 50);
    textSize(30);
    text(`Steps: ${steps}`, gridW * gridS + 15, 100);
    text(`Filled: ${grid.filter(i => i === 0).length}`, gridW * gridS + 15, 140);
    text("Speed:", gridW * gridS + 15, 180);
    text("Sandbox Settings:", gridW * gridS + 15, 260)
    textSize(25);
    text("Click to Change Ant Pos", gridW * gridS + 15, 295);
    text("Drag to Remove Filled Blocks", gridW * gridS + 15, 335);
}

function toggleSandbox(id) {
    if (!settings[id]) settings[id] = true;
    else settings[id] = settings[id] ? false : true;
}

function mousePressed() {
    if (settings[0]) {
        //Click to Change Ant Position
        if (mouseX > 0 && mouseX < gridW * gridS && mouseY > 0 && mouseY < gridH * gridS) {
            let x = Math.floor(mouseX / gridS);
            let y = Math.floor(mouseY / gridS);
            ant = y * gridW + x;
        }
    }
}

function mouseDragged() {
    if (settings[1]) {
        //Drag to Remove Filled Blocks
        //make area of impact larger
        if (mouseX > 0 && mouseX < gridW * gridS && mouseY > 0 && mouseY < gridH * gridS) {
            let x = Math.floor(mouseX / gridS);
            let y = Math.floor(mouseY / gridS);
            let index = y * gridW + x;
            if (grid[index] === 0) grid[index] = 1;
        }
    }
}