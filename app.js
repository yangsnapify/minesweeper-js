(function (global) {

    class MineSweeper {
        constructor() {
            this.grid = null;
            this.displayGrid = null;
            this.gridSize = 0;
            this.mapItemType = ["MINES"];
            this.mode = ["EASY", "HARD"];
            this.selectMode = this.mode[0];
            this.maxFillDepth = 2;
        }

        fmtData(x, y, v) {
            return {
                x,
                y,
                v
            }
        }

        createMap(x) {
            this.gridSize = x;
            function init() {
                return Array.from({ length: x }, (_, j) => Array.from({ length: x }, (_, k) => {
                    return {
                        x: j,
                        y: k,
                        v: null
                    }
                }));
            }

            if (!this.grid) {
                this.grid = init();
                this.displayGrid = init();
            }
            return this.grid;
        }

        checkNeighbor(x, y, cb) {
            const directions = [
                [-1, 0], [1, 0], [0, -1], [0, 1],
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ]
            directions.forEach(([dx, dy]) => {
                cb(dx + x, dy + y);
            })
        }

        checkIsBound(x, y) {
            return x >= 0 && x < this.grid.length && y >= 0 && y < this.grid.length;
        }

        formatMapItems(x, y) {
            if (this.grid[x][y].v === this.mapItemType[0]) return this.fmtData(x, y, this.mapItemType[0]);

            let minesCount = 0;
            this.checkNeighbor(x, y, (nx, ny) => {
                if (!this.checkIsBound(nx, ny)) return;

                if (this.grid[nx][ny].v === this.mapItemType[0]) {
                    minesCount += 1
                }
            })
            return {
                x,
                y,
                v: minesCount
            }
        }

        runner() {
            for (let i = 0; i < this.gridSize; i++) {
                for (let j = 0; j < this.gridSize; j++) {
                    this.displayGrid[i][j] = this.formatMapItems(i, j)
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

        floodFill(x, y) {
            let currentDepth = 0;
            this.markReveal(x, y)
            function runner(vx, vy) {
                this.checkNeighbor(vx, vy, (nx, ny) => {
                    if (!this.checkIsOutBound(nx, ny)) return;
                    if (this.grid[nx][ny] === this.mapItemType[0]) return;
                    if (currentDepth === this.maxFillDepth) return;
                    this.markReveal(nx, ny)
                    runner(nx, ny);
                })
                currentDepth += 1;
            }
            runner(x, y)
        }
    }

    global.MineSweeper = MineSweeper;
})(window)