(function (global) {

    class MineSweeper {
        constructor() {
            this.grid = null;
            this.gridSize = 0;
            this.mapItemType = ["MINES"];
            this.mode = ["EASY", "HARD"];
            this.selectMode = this.mode[0];
            this.maxFillDepth = 3;
        }

        fmtData(x, y, v, r = false) {
            return {
                x,
                y,
                v,
                revealed: r
            }
        }

        createMap(x) {
            let that = this;
            this.gridSize = x;
            function init() {
                return Array.from({ length: x }, (_, j) => Array.from({ length: x }, (_, k) => {
                    return that.fmtData(j, k, null)
                }));
            }

            if (!this.grid) {
                this.grid = init();
            }
            return this.grid;
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

        runner() {
            for (let i = 0; i < this.gridSize; i++) {
                for (let j = 0; j < this.gridSize; j++) {
                    this.grid[i][j] = this.formatMapItems(i, j)
                }
            }
        }

        placeMines(mines) {
            let current = 0;

            while (current < mines) {
                const x = Math.floor(Math.random() * this.gridSize);
                const y = Math.floor(Math.random() * this.gridSize);

                if (this.grid[x][y].v !== this.mapItemType[0]) {
                    this.grid[x][y] = this.fmtData(x, y, this.mapItemType[0])
                    current += 1;
                }
            }
        }

        calcMines() {
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

        floodFill(x, y) {
            x = parseInt(x);
            y = parseInt(y);

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