let [gridW, gridH, gridS] = [80, 80, 10];
let grid;
let ants = [];
let slider1;
let speed = 20;
let steps = 0;
let directions = [-gridW, 1, gridW, -1];
let settings = {};
let settingstxt = ["Click to Change Ant Pos", "Drag to Erase Filled Blocks", "Click to Add Another Ant", "Click to Remove An Ant"];
let textSpacing = 40;
function setup() {
    createCanvas(gridW * gridS + 450, gridH * gridS);
    frameRate(speed);
    grid = Array(gridW * gridH).fill(1);
    ants.push(new Ant(Math.round(gridH / 2) * gridW + Math.round(gridW / 2) - 1));
    slider1 = createSlider(5, 100, 20);
    slider1.position(gridW * gridS + 30, 200);
    slider1.style("width", "250px");
}

function draw() {
    background("#ebebeb");
    stroke(0);
    if (speed !== slider1.value()) {
        speed = Math.round(slider1.value());
        if (speed > 50) frameRate(50);
        else frameRate(speed);
    }
    for (let i = 0; i < gridH; i++) {
        for (let j = 0; j < gridW; j++) {
            let index = i * gridW + j;
            if (ants.map(a => a.pos).includes(index)) fill("red");
            else if (grid[index] === 1) fill(255);
            else fill(0);
            rect(j * gridS, i * gridS, gridS, gridS);
        }
    }

    for (let i = 0; i < Math.floor(speed / 50) + 1; i++) {
        for (let j of ants) j.move();
    }

    fill(0);
    textSize(40);
    textStyle(BOLD);
    noStroke();
    text("Langton's Ant", gridW * gridS + 15, 50);
    textSize(30);
    text(`Steps: ${steps}`, gridW * gridS + 15, 100);
    text(`Filled: ${grid.filter(i => i === 0).length}`, gridW * gridS + 15, 140);
    text("Speed:", gridW * gridS + 15, 180);
    text("Sandbox Settings:", gridW * gridS + 15, 260)
    textSize(25);
    for (let i = 0; i < settingstxt.length; i++) text(settingstxt[i], gridW * gridS + 15, 295 + i * textSpacing);

    if (settings[1]) {
        //Drag to Erase Filled Blocks (Event 1)
        if (mouseX > 0 && mouseX < gridW * gridS && mouseY > 0 && mouseY < gridH * gridS) {
            let r = 1;
            let scope = 2 * r + 1;
            if (mouseIsPressed) {
                let index = Math.floor(mouseY / gridS) * gridW + Math.floor(mouseX / gridS);
                let centerY = Math.floor(index / gridW);
                let centerX = index - centerY * gridW;
                let blocks = [];
                for (let i = 0; i < scope; i++) {
                    for (let j = 0; j < scope; j++) blocks.push((i - r) * gridW + j - r);
                }
                for (let i = 0; i < blocks.length; i++) {
                    let pos = index + blocks[i];
                    let y = Math.floor(pos / gridW);
                    let x = pos - y * gridW;
                    let xinc = x === centerX ? 0.5 : (x > centerX ? 0.3 : 0.7);
                    let yinc = y === centerY ? 0.5 : (y > centerY ? 0.3 : 0.7);
                    if (dist((x + xinc) * gridS, (y + yinc) * gridS, mouseX, mouseY) <= r * gridS) {
                        if (grid[pos] === 0) grid[pos] = 1;
                    }
                }
            }
            noFill();
            stroke(0);
            ellipse(mouseX, mouseY, 2 * r * gridS, 2 * r * gridS);
        }
    }
}

function toggleSandbox(id) {
    if (!settings[id]) settings[id] = true;
    else settings[id] = settings[id] ? false : true;
}

function mousePressed() {
    if (mouseX > 0 && mouseX < gridW * gridS && mouseY > 0 && mouseY < gridH * gridS) {
        if (settings[0]) {
            //Click to Change Ant Position (Event 0)
            let x = Math.floor(mouseX / gridS);
            let y = Math.floor(mouseY / gridS);
            let dists = ants.map(i => i.pos).map(i => dist(x, y, i - gridW * Math.floor(i / gridW), Math.floor(i / gridW)));
            if (ants[dists.indexOf(Math.min(...dists))]) ants[dists.indexOf(Math.min(...dists))].pos = y * gridW + x;
        }

        if (settings[2]) {
            //Click to Add Another Ant (Event 2)
            let x = Math.floor(mouseX / gridS);
            let y = Math.floor(mouseY / gridS);
            ants.push(new Ant(y * gridW + x));
        }

        if (settings[3]) {lemon
            //Click to Remove An Ant (Event 3)
            let x = Math.floor(mouseX / gridS);
            let y = Math.floor(mouseY / gridS);
            let dists = ants.map(i => i.pos).map(i => dist(x, y, i - gridW * Math.floor(i / gridW), Math.floor(i / gridW)));
            let closest = Math.min(...dists);
            if (closest < 5) ants.splice(dists.indexOf(closest), 1);
        }
    }
}