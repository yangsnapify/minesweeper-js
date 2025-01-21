"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function (global) {
  var isNode = typeof window === 'undefined';
  var GAME_MODES = {
    EASY: {
      name: 'EASY',
      minePercentage: 0.20
    },
    HARD: {
      name: 'HARD',
      minePercentage: 0.40
    }
  };
  var CELL_STATES = {
    HIDDEN: 'hidden',
    REVEALED: 'revealed',
    FLAGGED: 'flagged'
  };
  var MineSweeper = /*#__PURE__*/function () {
    function MineSweeper(config) {
      _classCallCheck(this, MineSweeper);
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
        gameMode: GAME_MODES.EASY,
        resetGame: false
      };
      this.update = this.update.bind(this);
      this.toui = this.toui.bind(this);
      if (!isNode) {
        this.initializeEventListeners();
      }
    }
    return _createClass(MineSweeper, [{
      key: "initializeEventListeners",
      value: function initializeEventListeners() {
        var _this = this;
        this.config.mapEl.addEventListener('click', function (event) {
          var cell = event.target.closest(".".concat(_this.config.cellsClass));
          if (!cell) return;
          var _cell$dataset = cell.dataset,
            x = _cell$dataset.x,
            y = _cell$dataset.y;
          _this.floodFill(parseInt(x), parseInt(y), _this.update);
        });
        this.config.mapEl.addEventListener('contextmenu', function (event) {
          event.preventDefault();
          var cell = event.target.closest(".".concat(_this.config.cellsClass));
          if (!cell) return;
          var _cell$dataset2 = cell.dataset,
            x = _cell$dataset2.x,
            y = _cell$dataset2.y;
          _this.updateMinesStatus(parseInt(x), parseInt(y), cell);
        });
      }
    }, {
      key: "createGrid",
      value: function createGrid(v) {
        var _this2 = this;
        if (v) {
          this.config.size = v;
        }
        return Array.from({
          length: this.config.size
        }, function (_, i) {
          return Array.from({
            length: _this2.config.size
          }, function (_, j) {
            return {
              x: i,
              y: j,
              value: null,
              state: CELL_STATES.HIDDEN
            };
          });
        });
      }
    }, {
      key: "placeMines",
      value: function placeMines() {
        var totalMines = Math.round(this.config.size * this.config.size * this.state.gameMode.minePercentage);
        this.state.minesCount = totalMines;
        while (this.state.minesCoords.size < totalMines) {
          var x = Math.floor(Math.random() * this.config.size);
          var y = Math.floor(Math.random() * this.config.size);
          var coordKey = "".concat(x, ",").concat(y);
          if (!this.state.minesCoords.has(coordKey)) {
            this.state.minesCoords.add(coordKey);
            this.state.grid[x][y].value = 'MINES';
          }
        }
      }
    }, {
      key: "calculateAdjacentMines",
      value: function calculateAdjacentMines() {
        var directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (var x = 0; x < this.config.size; x++) {
          for (var y = 0; y < this.config.size; y++) {
            if (this.state.grid[x][y].value === 'MINES') continue;
            var mineCount = 0;
            var _iterator = _createForOfIteratorHelper(directions),
              _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var _step$value = _slicedToArray(_step.value, 2),
                  dx = _step$value[0],
                  dy = _step$value[1];
                var newX = x + dx;
                var newY = y + dy;
                if (this.isValidCell(newX, newY) && this.state.grid[newX][newY].value === 'MINES') {
                  mineCount++;
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
            this.state.grid[x][y].value = mineCount;
          }
        }
      }
    }, {
      key: "isValidCell",
      value: function isValidCell(x, y) {
        return x >= 0 && x < this.config.size && y >= 0 && y < this.config.size;
      }
    }, {
      key: "floodFill",
      value: function floodFill(x, y) {
        if (!this.isValidCell(x, y) || this.state.grid[x][y].state === CELL_STATES.REVEALED || this.state.grid[x][y].state === CELL_STATES.FLAGGED) {
          return;
        }
        var cell = this.state.grid[x][y];
        cell.state = CELL_STATES.REVEALED;
        if (cell.value === 'MINES') {
          this.gameOver();
        }
        if (cell.value === 0) {
          var directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
          for (var _i = 0, _directions = directions; _i < _directions.length; _i++) {
            var _directions$_i = _slicedToArray(_directions[_i], 2),
              dx = _directions$_i[0],
              dy = _directions$_i[1];
            this.floodFill(x + dx, y + dy);
          }
        }
        this.update();
        this.checkWinCondition();
      }
    }, {
      key: "gameOver",
      value: function gameOver() {
        var _this3 = this;
        setTimeout(function () {
          alert('Game Over! Starting new game...');
          _this3.run();
        }, 1000);
      }
    }, {
      key: "run",
      value: function run(v) {
        this.resetGame = false;
        this.state.grid = this.createGrid(v);
        this.setStyle();
        this.state.markMinesArr.clear();
        this.state.minesCoords.clear();
        this.placeMines();
        this.calculateAdjacentMines();
        this.update();
        this.updateMineCounter();
      }
    }, {
      key: "setStyle",
      value: function setStyle() {
        if (this.config.mapEl) {
          this.config.mapEl.style["grid-template-columns"] = "repeat(".concat(this.config.size, ", 1fr)");
        }
      }
    }, {
      key: "updateMineCounter",
      value: function updateMineCounter() {
        this.config.countEl.textContent = this.state.minesCount;
      }
    }, {
      key: "toui",
      value: function toui(cell) {
        var cellContent = cell.state === CELL_STATES.REVEALED ? cell.value : '';
        var flagged = this.state.markMinesArr.has("".concat(cell.x, ",").concat(cell.y));
        var backgroundColor = flagged ? 'red' : 'none';
        return "\n                <div \n                    class=\"".concat(this.config.cellsClass, "\"\n                    data-x=\"").concat(cell.x, "\"\n                    data-y=\"").concat(cell.y, "\"\n                    style=\"background: ").concat(backgroundColor, "\"\n                >\n                    ").concat(cellContent, "\n                </div>\n            ");
      }
    }, {
      key: "update",
      value: function update() {
        var _this4 = this;
        var html = this.state.grid.flat().map(function (cell) {
          return _this4.config.formatter ? _this4.config.formatter(cell) : _this4.toui(cell);
        }).join('');
        this.config.mapEl.innerHTML = html;
      }
    }, {
      key: "updateMinesStatus",
      value: function updateMinesStatus(x, y, element) {
        var coordKey = "".concat(x, ",").concat(y);
        var cell = this.state.grid[x][y];
        if (cell.state === CELL_STATES.REVEALED) return;
        if (this.state.markMinesArr.has(coordKey)) {
          this.state.markMinesArr["delete"](coordKey);
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
    }, {
      key: "checkWinCondition",
      value: function checkWinCondition() {
        var _this5 = this;
        if (this.resetGame) return;
        if (this.state.minesCount === 0) {
          var allMinesFlagged = Array.from(this.state.minesCoords).every(function (coord) {
            return _this5.state.markMinesArr.has(coord);
          });
          var allNonMinesRevealed = this.state.grid.flat().every(function (cell) {
            return cell.value === 'MINES' || cell.state === CELL_STATES.REVEALED;
          });
          if (allMinesFlagged && allNonMinesRevealed) {
            this.resetGame = true;
            setTimeout(function () {
              alert('Congratulations! You won!');
              _this5.run(_this5.config.size + 1);
            }, 1500);
          }
        }
      }
    }]);
  }();
  if (isNode) {
    module.exports = MineSweeper;
  } else {
    global.MineSweeper = MineSweeper;
  }
})(globalThis);
