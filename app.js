(function(global) {
    
    class MineSweeper {
        constructor() {
            this.maps = null;
            this.gridSize = 0;
            this.mapItemType = ["MINES", "DEFAULT"];
            this.mode = ["EASY", "HARD"];
            this.selectMode = this.mode[0];
        }

        createMap(x) {
            this.gridSize = x;
            if (!this.maps) {
                this.maps = Array.from({ length: x }, () => Array.from({ length: x }, () => null));
            }
            return this.maps;
        }

        formatMapItems(x, y) {
            let minesCount = 0;
            const directions = [
                [-1, 0], [1, 0], [0, -1], [0, 1],
                [-1, -1], [-1, 1], [1, -1], [1, 1]
            ]
            directions.forEach(([dx, dy]) => {
                const nx = dx + x;
                const ny = dy + y;

                if (nx >= 0 && nx < this.maps.length && ny >= 0 && ny < this.maps.length ) {
                    if (this.maps[nx][ny] === this.mapItemType[0]) {
                        minesCount += 1
                    }
                }
            })
            return minesCount;
        }

        placeMines(mines) {
            let current = 0;

            while (current < mines) {
                const x = Math.floor(Math.random() * this.gridSize);
                const y = Math.floor(Math.random() * this.gridSize);

                if (this.maps[x][y] !== this.mapItemType[0]) {
                    this.maps[x][y] = this.mapItemType[0];
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