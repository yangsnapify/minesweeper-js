(function(global) {
    
    class MineSweeper {
        constructor() {
            this.maps = null;
            this.mapItemType = {
                0 : "MINES",
                1 : "DEFAULT"
            }
        }

        createMap(x) {
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
                    if (this.maps[nx][ny] === this.mapType[0]) {
                        minesCount += 1
                    }
                }
            })
            return minesCount;
        }
    }

    global.MineSweeper = MineSweeper;
})(window)