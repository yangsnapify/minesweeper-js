# Minesweeper Game

Welcome to my Minesweeper game! Click the link below to start playing:

A classic Minesweeper game implementation in JavaScript using a class-based approach. This implementation features customizable grid size, different difficulty modes, and a clean, modular architecture.

👉 [Play Minesweeper Now!](https://yangsnapify.github.io/minesweeper-js/)

Have fun and enjoy the challenge!

## Features

- Two difficulty modes: Easy (20% mines) and Hard (40% mines)
- Customizable grid size
- Right-click to flag potential mines
- Flood fill algorithm for revealing empty cells
- Mine counter display
- Automatic game restart on win/loss
- Flexible cell rendering with custom formatter support

## Installation

1. Include the Minesweeper script in your HTML file:
```html
<script src="path/to/dist.js"></script>
```

2. While the package can be required in Node.js environment:
```javascript
const MineSweeper = require('jlgy-minesweeper');
```
Note: The Node.js environment is only supported for module loading - the game functionality requires a browser environment as it depends on DOM manipulation.

3. Add the required HTML elements:
```html
<div id="count"></div>
<div id="maps"></div>
```

## Usage

Initialize the game with your desired configuration:

```javascript
const minesweeper = new MineSweeper({
    size: 5,                                    // Grid size (5x5)
    countEl: document.getElementById("count"),  // Mine counter element
    mapEl: document.getElementById("maps"),     // Game grid element
    cellsClass: "v1",                          // CSS class for cells
    formatter: (cell) => {                     // Optional custom cell formatter
        const backgroundColor = cell.state === 'flagged' ? 'red' : 'none';
        return `
            <div 
                class="v1"
                style="background: ${backgroundColor}" 
                data-x="${cell.x}"
                data-y="${cell.y}"
            >
                ${cell.state === "revealed" ? cell.value : ''}
            </div>
        `;
    }
});

// Start the game
minesweeper.run();
```

## Cell Attributes and Structure

Each cell in the grid is an object with the following attributes:

```javascript
{
    x: number,          // X coordinate in the grid
    y: number,          // Y coordinate in the grid
    value: number|null|'MINES',  // Cell content (null when hidden, number for adjacent mines, 'MINES' for mine)
    state: string       // Current cell state ('hidden', 'revealed', or 'flagged')
}
```

### Cell Values Explanation:
- `x, y`: Grid coordinates (0-based)
- `value`: 
  - `null`: Initial state
  - `'MINES'`: Contains a mine
  - `0`: No adjacent mines
  - `1-8`: Number of adjacent mines
- `state`: 
  - `'hidden'`: Initial state, content not visible
  - `'revealed'`: Content is visible
  - `'flagged'`: Marked as potential mine

## Rendering and Formatting

### Default Rendering
If no formatter is provided, the game uses a default renderer that creates basic div elements:

```javascript
// Default internal renderer
toui(cell) {
    const cellContent = cell.state === 'revealed' ? cell.value : '';
    const flagged = cell.state === 'flagged';
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
```

### Custom Formatter Requirements
When using a custom formatter:

1. The `cellsClass` option MUST be provided
2. The formatter MUST include `data-x` and `data-y` attributes
3. The formatter function receives the cell object as parameter

Example of a valid custom formatter:
```javascript
formatter: (cell) => {
    return `
        <div 
            class="v1"                          // Required: matches cellsClass
            data-x="${cell.x}"                  // Required: x coordinate
            data-y="${cell.y}"                  // Required: y coordinate
            style="background: ${cell.state === 'flagged' ? 'red' : 'none'}"
        >
            <span class="cell-content">         // Custom: Additional elements
                ${cell.state === "revealed" ? cell.value : ''}
            </span>
        </div>
    `;
}
```
Example of not using custom formatter:
```javascript
const map = new MineSweeper({
    size: 5,
    countEl: document.getElementById("count"),
    mapEl: document.getElementById("maps"),
    cellsClass: "v1",
});
map.run();
```

## Configuration Options

| Option | Type | Description | Required |
|--------|------|-------------|-----------|
| size | Number | Size of the grid (creates a size x size grid) | Yes |
| countEl | HTMLElement | DOM element to display the mine counter | Yes |
| mapEl | HTMLElement | DOM element to contain the game grid | Yes |
| cellsClass | String | CSS class name for the grid cells | Yes |
| formatter | Function | Custom function to format cell HTML | No |

## Game States

Each cell can be in one of three states:
- `hidden`: Initial state, cell contents not revealed
- `revealed`: Cell has been clicked and contents are visible
- `flagged`: Cell has been flagged as a potential mine

## How to Play

1. Left-click to reveal a cell
2. Right-click to flag/unflag a potential mine
3. Numbers indicate how many mines are adjacent to the cell
4. Reveal all non-mine cells and flag all mines to win
5. Game automatically restarts if you hit a mine or win

## Events

The game handles two main events:
- Left-click: Reveals cells and triggers flood fill for empty cells
- Right-click (contextmenu): Toggles flag status on cells

## Winning Condition

The game is won when:
1. All mines are correctly flagged
2. All non-mine cells are revealed
3. The mine counter reaches zero

## CSS Styling

Add your own CSS to style the grid and cells. Example:

```css
.v1 {
    width: 30px;
    height: 30px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
```

## Technical Implementation

The game uses several key algorithms and data structures:
- Flood fill for revealing empty cells
- Set data structure for tracking mines and flags
- Random mine placement with duplicate prevention
- Adjacent mine calculation using direction arrays

## License

This project is open source and available under the MIT License.