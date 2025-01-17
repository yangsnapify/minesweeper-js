(function (global) {

    class MineSweeper {
        constructor(conf) {
            this.grid = null;
            this.gridSize = conf.size;
            this.mapItemType = ["MINES"];
            this.mode = ["EASY", "HARD"];
            this.selectMode = this.mode[0];
            this.maxFillDepth = 3;
            this.minesCount = 0;
            this.countEl = conf.countEl;
            this.mapEl = conf.mapEl;
            this.cellEl = conf.cellsClass;
            this.fmt = conf.formatter;
            this.markMinesArr = [];
            this.minesCoords = [];

            this.toui = this.toui.bind(this);
            this.update = this.update.bind(this);
        }

        reRunCount() {
            this.countEl.innerHTML = this.minesCount;
        }

        updateMinesStatus(x, y, el) {
            console.log(x, y, el)
            x = parseInt(x);
            y = parseInt(y);

            if (this.minesCount === 0 && this.minesCoords.every((j, i) => j[0] === this.markMinesArr[i][0] && j[1] === this.markMinesArr[i][1])) {
                console.log('win')
                this.run()
                return;
            }
            if (this.grid[x][y].revealed) {
                return;
            }

            const isMarked = this.markMinesArr.some(j => j[0] === x && j[1] === y);

            if (el) {
                if (isMarked) {
                    this.markMinesArr = this.markMinesArr.filter((j, i) => j[0] + j[1] !== x + y);
                    el.style.background = "none"
                    this.minesCount++;
                    this.reRunCount();
                } else {
                    if (this.minesCount === 0) {
                        return;
                    }
                    this.markMinesArr.push([x, y]);
                    el.style.background = "red"
                    this.minesCount--;
                    this.reRunCount();
                }
            }
        }

        fmtData(x, y, v, r = false) {
            return {
                x,
                y,
                v,
                revealed: r
            }
        }

        run() {
            this.markMinesArr = [];
            this.createMap();
            this.placeMines(this.getMinesPercentage()).readyGrid();
            this.reRunCount();
            this.update(this.grid);
        }

        createMap() {
            const that = this;
            const x = this.gridSize;
            function init() {
                return Array.from({ length: x }, (_, j) => Array.from({ length: x }, (_, k) => {
                    return that.fmtData(j, k, null)
                }));
            }
            this.grid = init();
            return this;
        }

        checkNeighbor(x, y, cb) {
            const directions = [
                [-1, 0], [1, 0], [0, -1], [0, 1],
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ]
            directions.forEach(([dx, dy], index) => {
                cb(dx + x, dy + y, index);
            })
        }

        checkNeighborContainMines(x, y) {
            let isContainMines = false;
            this.checkNeighbor(x, y, (nx, ny) => {
                if (this.checkIsBound(nx, ny) && this.grid[nx][ny].v === this.mapItemType[0]) {
                    isContainMines = true;
                }
            })
            return isContainMines;
        }

        checkIsBound(x, y) {
            return x >= 0 && x < this.grid.length && y >= 0 && y < this.grid.length;
        }

        formatMapItems(x, y) {
            let that = this;
            if (this.grid[x][y].v === this.mapItemType[0]) {
                return this.fmtData(x, y, this.mapItemType[0]);
            }

            let _minesCount = 0;
            this.checkNeighbor(x, y, function (nx, ny) {
                if (!that.checkIsBound(nx, ny)) return;
                if (that.grid[nx][ny].v === that.mapItemType[0]) {
                    _minesCount += 1
                }
            })
            return this.fmtData(x, y, _minesCount);
        }

        readyGrid() {
            for (let i = 0; i < this.gridSize; i++) {
                for (let j = 0; j < this.gridSize; j++) {
                    this.grid[i][j] = this.formatMapItems(i, j)
                }
            }
        }

        placeMines(mines) {
            this.minesCount = mines;
            let current = 0;

            while (current < mines) {
                const x = Math.floor(Math.random() * this.gridSize);
                const y = Math.floor(Math.random() * this.gridSize);
                this.minesCoords.push([x, y]);
                if (this.grid[x][y].v !== this.mapItemType[0]) {
                    this.grid[x][y] = this.fmtData(x, y, this.mapItemType[0])
                    current += 1;
                }
            }
            return this;
        }

        getMinesPercentage() {
            let _mode = this.selectMode;
            let minesPercentage = 0;

            if (_mode === this.mode[0]) {
                minesPercentage = 0.10;
            }
            if (_mode === this.mode[1]) {
                minesPercentage = 0.20
            }

            const totalGridSize = this.gridSize * this.gridSize;
            return Math.round(totalGridSize * minesPercentage);
        }

        updateRevealStatus(x, y, v) {
            this.grid[x][y] = {
                ...this.grid[x][y],
                revealed: typeof v === "boolean" ? v : true
            }
        }

        floodFill(x, y, updateUI) {
            x = parseInt(x);
            y = parseInt(y);

            if (this.markMinesArr.some(j => j[0] === x && j[1] === y)) return;

            this.updateRevealStatus(x, y);
            if (this.grid[x][y].v === this.mapItemType[0]) {
                setTimeout(() => {
                    alert("you lose resetting game");
                    this.run()
                    updateUI(this.grid);
                }, 1000);
                return;
            }


            let that = this;
            const isInvalid = (px, py) => !this.checkIsBound(px, py) || this.grid[px][py].v === this.mapItemType[0] || this.grid[px][py].revealed;

            function _run(vx, vy) {
                that.checkNeighbor(vx, vy, (nx, ny) => {
                    if (isInvalid(nx, ny)) return;
                    if (that.markMinesArr.some(j => j[0] === nx && j[1] === ny)) return;
                    if (!that.checkNeighborContainMines(nx, ny)) {
                        that.updateRevealStatus(nx, ny);
                        _run(nx, ny)
                    }
                });
            }
            _run(x, y);
        }

        toui(val) {
            return Array.isArray(val) ? val.map(this.toui).join("") : `<div data-x=${val.x} data-y=${val.y} data-v=${val.v} class="v1">
                ${val.revealed ? val.v : `<span></span>`}
            </div>`
        }

        update(mapData) {
            const that = this;
            let ui;
            if (typeof this.fmt === 'function') {
                ui = this.fmt(mapData);
            } else {
                ui = this.toui(mapData)
            }
            this.mapEl.innerHTML = ui;
        
            const items = document.getElementsByClassName(this.cellEl);
            
            if (items && items.length > 0) {
                let itemsIndex = 0;
                for (let rowIndex = 0; rowIndex < this.gridSize; rowIndex++) {
                    for (let colIndex = 0; colIndex < this.grid[rowIndex].length; colIndex++) {                
                        const value = items[itemsIndex];
                        
                        if (!value) {
                            console.warn(`No element found at index ${itemsIndex}`);
                            continue;
                        }
        
                        const xcoord = this.grid[rowIndex][colIndex].x;
                        const ycoord = this.grid[rowIndex][colIndex].y;
        
                        const isSelected = this.markMinesArr.some(j => j[0] === xcoord && j[1] === ycoord);
                        if (isSelected) {
                            value.style.background = "red";
                        }
        
                        value.addEventListener("click", (event) => {
                            that.floodFill(xcoord, ycoord, that.update);
                            that.update(this.grid, this.markMinesArr);
                        });
        
                        value.addEventListener("contextmenu", (event) => {
                            event.preventDefault();
                            that.updateMinesStatus(xcoord, ycoord, value);
                        });
                        
                        itemsIndex++;
                    }
                }
            }
        }
    }

    global.MineSweeper = MineSweeper;
})(window)