(function(global) {
    
    class MineSweeper {
        constructor() {
            this.map = null;
        }

        createMap(x) {
            if (!this.map) {
                this.map = Array.from({ length: x }, () => Array.from({ length: x }, () => null));
                console.log(this.map)
            }
            return this.map;
        }
    }

    global.MineSweeper = MineSweeper;
})(window)