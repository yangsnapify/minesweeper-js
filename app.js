(function(global) {
    
    class MineSweeper {
        constructor() {
            this.grid = null;
            this.displayGrid = null;
            this.gridSize = 0;
            this.mapItemType = ["MINES"];
            this.mode = ["EASY", "HARD"];
            this.selectMode = this.mode[0];
        }

        createMap(x) {
            this.gridSize = x;
            function init() {
                return Array.from({ length: x }, () => Array.from({ length: x }, () => null));
            }
            
            if (!this.grid) {
                this.grid = init();
                this.displayGrid = init();
            }
            return this.grid;
        }

        formatMapItems(x, y) {
            if (this.grid[x][y] === this.mapItemType[0]) return this.mapItemType[0];

            let minesCount = 0;
            const directions = [
                [-1, 0], [1, 0], [0, -1], [0, 1],
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ]
            directions.forEach(([dx, dy]) => {
                const nx = dx + x;
                const ny = dy + y;

                if (nx >= 0 && nx < this.grid.length && ny >= 0 && ny < this.grid.length ) {
                    if (this.grid[nx][ny] === this.mapItemType[0]) {
                        minesCount += 1
                    }
                }
            })
            return minesCount;
        }
        
        runner() {
            for (let i = 0; i < this.gridSize; i ++ ) {
                for (let j = 0; j < this.gridSize; j ++ ) {
                    this.displayGrid[i][j] = this.formatMapItems(i, j)
                }
            }
        }

        placeMines(mines) {
            let current = 0;

            while (current < mines) {
                const x = Math.floor(Math.random() * this.gridSize);
                const y = Math.floor(Math.random() * this.gridSize);

                if (this.grid[x][y] !== this.mapItemType[0]) {
                    this.grid[x][y] = this.mapItemType[0];
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
    }

    global.MineSweeper = MineSweeper;
})(window)