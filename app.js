(function (global) {
    const GAME_MODES = {
        EASY: { name: 'EASY', minePercentage: 0.10 },
        HARD: { name: 'HARD', minePercentage: 0.20 }
    };

    const CELL_STATES = {
        HIDDEN: 'hidden',
        REVEALED: 'revealed',
        FLAGGED: 'flagged'
    };

    class MineSweeper {
        constructor(config) {
            this.config = {
                size: config.size,
                countEl: config.countEl,
                mapEl: config.mapEl,
                cellsClass: config.cellsClass,
                formatter: config.formatter
            };

            this.state = {
                grid: null,
                minesCount: 0,
                markMinesArr: new Set(),
                minesCoords: new Set(),
                gameMode: GAME_MODES.EASY
            };

            this.update = this.update.bind(this);
            this.toui = this.toui.bind(this);

            this.initializeEventListeners();
        }

        initializeEventListeners() {
            this.config.mapEl.addEventListener('click', (event) => {
                const cell = event.target.closest(`.${this.config.cellsClass}`);
                if (!cell) return;

                const { x, y } = cell.dataset;
                this.floodFill(parseInt(x), parseInt(y), this.update);
            });

            this.config.mapEl.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                const cell = event.target.closest(`.${this.config.cellsClass}`);
                if (!cell) return;

                const { x, y } = cell.dataset;
                this.updateMinesStatus(parseInt(x), parseInt(y), cell);
            });
        }

        createGrid() {
            return Array.from({ length: this.config.size }, (_, i) =>
                Array.from({ length: this.config.size }, (_, j) => ({
                    x: i,
                    y: j,
                    value: null,
                    state: CELL_STATES.HIDDEN
                }))
            );
        }

        placeMines() {
            const totalMines = Math.round(this.config.size * this.config.size * this.state.gameMode.minePercentage);
            this.state.minesCount = totalMines;
            while (this.state.minesCoords.size < totalMines) {
                const x = Math.floor(Math.random() * this.config.size);
                const y = Math.floor(Math.random() * this.config.size);
                const coordKey = `${x},${y}`;
                if (!this.state.minesCoords.has(coordKey)) {
                    this.state.minesCoords.add(coordKey);
                    this.state.grid[x][y].value = 'MINES';
                }
            }
        }

        calculateAdjacentMines() {
            const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
            for (let x = 0; x < this.config.size; x++) {
                for (let y = 0; y < this.config.size; y++) {
                    if (this.state.grid[x][y].value === 'MINES') continue;

                    let mineCount = 0;
                    for (const [dx, dy] of directions) {
                        const newX = x + dx;
                        const newY = y + dy;
                        if (this.isValidCell(newX, newY) && this.state.grid[newX][newY].value === 'MINES') {
                            mineCount++;
                        }
                    }
                    this.state.grid[x][y].value = mineCount;
                }
            }
        }

        isValidCell(x, y) {
            return x >= 0 && x < this.config.size && y >= 0 && y < this.config.size;
        }

        floodFill(x, y) {
            if (!this.isValidCell(x, y) ||
                this.state.grid[x][y].state === CELL_STATES.REVEALED ||
                this.state.grid[x][y].state === CELL_STATES.FLAGGED) {
                return;
            }

            const cell = this.state.grid[x][y];
            cell.state = CELL_STATES.REVEALED;

            if (cell.value === 'MINES') {
                this.gameOver();
            }

            if (cell.value === 0) {
                const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
                for (const [dx, dy] of directions) {
                    this.floodFill(x + dx, y + dy);
                }
            }

            this.update();
            this.checkWinCondition();
        }

        gameOver() {
            setTimeout(() => {
                alert('Game Over! Starting new game...');
                this.run();
            }, 1000);
        }

        run() {
            this.state.grid = this.createGrid();
            this.state.markMinesArr.clear();
            this.state.minesCoords.clear();
            this.placeMines();
            this.calculateAdjacentMines();
            this.update();
            this.updateMineCounter();
        }

        updateMineCounter() {
            this.config.countEl.textContent = this.state.minesCount;
        }

        toui(cell) {
            const cellContent = cell.state === CELL_STATES.REVEALED ? cell.value : '';
            const flagged = this.state.markMinesArr.has(`${cell.x},${cell.y}`);
            const backgroundColor = flagged ? 'red' : 'none';

            return `
                <div 
                    class="${this.config.cellsClass}"
                    data-x="${cell.x}"
                    data-y="${cell.y}"
                    style="background: ${backgroundColor}"
                >
                    ${cellContent}
                </div>
            `;
        }

        update() {
            const html = this.state.grid
                .flat()
                .map(cell => this.config.formatter ? this.config.formatter(cell) : this.toui(cell))
                .join('');
            this.config.mapEl.innerHTML = html;
        }

        updateMinesStatus(x, y, element) {
            const coordKey = `${x},${y}`;
            const cell = this.state.grid[x][y];

            if (cell.state === CELL_STATES.REVEALED) return;

            if (this.state.markMinesArr.has(coordKey)) {
                this.state.markMinesArr.delete(coordKey);
                cell.state = CELL_STATES.HIDDEN;
                element.style.background = 'none';
                this.state.minesCount++;
            } else if (this.state.minesCount > 0) {
                this.state.markMinesArr.add(coordKey);
                cell.state = CELL_STATES.FLAGGED;
                element.style.background = 'red';
                this.state.minesCount--;
            }

            this.updateMineCounter();
            this.checkWinCondition();
        }

        checkWinCondition() {
            if (this.state.minesCount === 0) {
                const allMinesFlagged = Array.from(this.state.minesCoords)
                    .every(coord => this.state.markMinesArr.has(coord));

                const allNonMinesRevealed = this.state.grid
                    .flat()
                    .every(cell =>
                        cell.value === 'MINES' ||
                        cell.state === CELL_STATES.REVEALED
                    );

                if (allMinesFlagged && allNonMinesRevealed) {
                    setTimeout(() => {
                        alert('Congratulations! You won!');
                    this.run();
                    }, 1500);
                }
            }
        }
    }

    global.MineSweeper = MineSweeper;
})(window);