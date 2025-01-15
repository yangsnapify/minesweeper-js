(function (global) {

    class MineSweeper {
        constructor(size) {
            this.grid = null;
            this.gridSize = size;
            this.mapItemType = ["MINES"];
            this.mode = ["EASY", "HARD"];
            this.selectMode = this.mode[0];
            this.maxFillDepth = 3;
            this.minesCount = 0;
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
            this.createMap();
            this.placeMines(this.getMinesPercentage()).readyGrid()
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
            if (this.grid[x][y].v === this.mapItemType[0]) return this.fmtData(x, y, this.mapItemType[0]);

            let minesCount = 0;
            this.checkNeighbor(x, y, function (nx, ny) {
                if (!that.checkIsBound(nx, ny)) return;
                if (that.grid[nx][ny].v === that.mapItemType[0]) {
                    minesCount += 1
                }
            })
            return this.fmtData(x, y, minesCount);
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

                if (this.grid[x][y].v !== this.mapItemType[0]) {
                    this.grid[x][y] = this.fmtData(x, y, this.mapItemType[0])
                    current += 1;
                }
            }
            return this;
        }

        markMines(x, y, isRevealed) {
            if (!isRevealed) {
                
            }
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

        markReveal(x, y) {
            this.grid[x][y] = {
                ...this.grid[x][y],
                revealed: true
            }
        }

        floodFill(x, y, updateUI) {
            x = parseInt(x);
            y = parseInt(y);
            this.markReveal(x, y);
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
                    if (!that.checkNeighborContainMines(nx, ny)) {
                        that.markReveal(nx, ny);
                        _run(nx, ny)
                    }
                });
            }
            _run(x, y);
        }
    }

    global.MineSweeper = MineSweeper;
})(window)