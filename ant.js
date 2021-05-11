function Ant(index) {
    this.pos = index;
    this.dir = -gridW;
    
    this.move = function() {
        grid[this.pos] = grid[this.pos] === 1 ? 0 : 1;
        if (grid[this.pos] === 0) {
            //white square
            this.dir = directions[directions.indexOf(this.dir) + 1];
            if (!this.dir) this.dir = directions[0];
        } else {
            //black square
            this.dir = directions[directions.indexOf(this.dir) - 1];
            if (!this.dir) this.dir = directions[3];
        }
        this.pos += this.dir;
        steps++;
    }
}