var Cell = function(alive) {
    this.alive = alive;
    this.deadColor = 0;
    this.aliveColor = 255;
    this.color = alive ? this.aliveColor : this.deadColor;
    this.neighbours = [];

    this.toggle = function() {
        this.alive = (!this.alive);
        this.color = this.alive ? this.aliveColor : this.deadColor;
    };

    this.addNeighbour = function(cell) {
        this.neighbours.push(cell);
    };

    this.getActiveNeighbours = function() {
        var count = 0;
        for (var i = 0; i < this.neighbours.length; i++) {
            if (this.neighbours[i].alive) {
                count++;
            }
        }
        return count;
    };
};

var Entity = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.update = function(dt) {};
    this.render = function(engine) {};
};

var CellManager = function(cells, dx, w, h) {
    Entity.call(this, dx, 0, w, h);
    this.cells = cells;
    this.selectedCell;
    this.onMouseMove = function(x, y) {
        if (typeof(this.selectedCell) !== "undefined") {
            this.selectedCell.color = this.selectedCell.alive ? 255 : 0;
        }
        cells[x][y].color = 200;
        this.selectedCell = cells[x][y];
    }
    this.onMouseClick = function(x, y) {
        cells[x][y].toggle();
    }
    this.render = function(engine) {
        engine.drawPixels(this.cells, this.x, this.y);
    };
};

var Pattern = function(x, y, w, h) {
    Control.call(this, x, y, w, h);
    this.color = "white";
    this.dragged = false;
    this.strPattern = "000111000";
    this.render = function(engine) {
        engine.drawRect(this.x, this.y, this.w, this.h, this.color);
        engine.drawText(this.x, this.y + 5, "glider", "grey", "30px verdana");
        // var index = 0;
        // var color;
        // for (var i = 0; i < this.width; i++) {
        //     for (var j  = 0; j < this.height; j++) {
        //         color = parseInt(this.strPattern[index]) ?  "yellow" : "#f0f0f5";
        //         engine.drawRect(this.x + i, this.y + j, 1, 1, color);
        //         index++;
        //     }
        // }
    };
};

var Control = function(x, y, w, h) {
    Entity.call(this, x, y, w, h);
    this.selectedColor = "#FFC";
    this.notSelectedColor = "white";
    this.selected = false;
    this.select = function() {
        console.log("selected");
        this.selected = true;
        this.color = this.selectedColor;
    };
    this.deSelect = function() {
        this.selected = false;
        this.color = this.notSelectedColor;
    };

}
var Button = function(x, y, w, h, text, startButtonCallback) {
    Control.call(this, x, y, w, h);
    this.color = "white";
    this.text = text;
    this.onClick = startButtonCallback;
    this.render = function(engine) {
        engine.drawRect(this.x, this.y, this.w, this.h, this.color);
        engine.drawText(this.x, this.y + 5, this.text, "grey", "30px verdana");
    };
};

var PatternPanel = function(w, h, startButtonCallback, stopButtonCallback, clearButtonCallback, randButtonCallback) {
    Entity.call(this, 0, 0, w, h);
    this.color = "#CCC";
    this.components = [];
    this.buttonX = this.x + 1;
    this.buttonY = this.y + 1;
    this.buttonWidth = 18;
    this.buttonHeight = 6;
    this.startButton = new Button(this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, "start", startButtonCallback);
    this.components.push(this.startButton);

    this.stopButton = new Button(this.buttonX, this.buttonY + this.buttonHeight + 1, this.buttonWidth, this.buttonHeight, "pause", stopButtonCallback);
    this.components.push(this.stopButton);

    this.clearButton = new Button(this.buttonX, this.buttonY + 2 * (this.buttonHeight + 1), this.buttonWidth, this.buttonHeight, "clear", clearButtonCallback);
    this.components.push(this.clearButton);

    this.randButton = new Button(this.buttonX, this.buttonY + 3 * (this.buttonHeight + 1), this.buttonWidth, this.buttonHeight, "rand", randButtonCallback);
    this.components.push(this.randButton);

    this.glider = new Pattern(this.buttonX, this.buttonY + 4 * (this.buttonHeight + 1), this.buttonWidth, this.buttonHeight);
    this.components.push(this.glider);

    this.selected = null;

    this.getSelectedComponent = function(x, y) {
        var c;
        for (var i in this.components) {
            c = this.components[i];
            if (x >= c.x && x < c.x + c.w && y >= c.y && y < c.y + c.h) {
                return c;
            }
        }
        return null;

    }

    this.onMouseMove = function(x, y) {
        if (this.selected instanceof Pattern && this.selected.dragged === true) {
            this.selected.x = x;
            this.selected.y = y;
        } else {
        var c = this.getSelectedComponent(x - this.x, y - this.y);
        if (c !== this.selected) {
            if (c !== null) {
                c.select();
            }
            if (this.selected !== null) {
                this.selected.deSelect();
            }
            this.selected = c;
        }
            
        }

    }

    this.onMouseClick = function() {
        if (this.selected instanceof Button) {
            this.selected.onClick();
        }
    };
    this.onMouseDown = function() {
        if (this.selected instanceof Pattern) {
            this.selected.dragged = true;
        }
    };
    this.render = function(engine) {
        engine.drawRect(this.x, this.y, this.w, this.h, this.color);
        for (var i = 0; i < this.components.length; i++) {
            this.components[i].render(engine);
        }
    };


    // this.patterns = [new Pattern(100, 0)];
    // this.getPatternCopy = function(x, y) {
    //     var p;
    //     for (var i = 0; i < this.patterns.length; i++) {
    //         p = this.patterns[i];
    //         if (x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height) {
    //             var copyPatern = new Pattern(p.x, p.y);
    //             this.patterns.push(copyPatern);
    //             return copyPatern;
    //         }
    //     }
    // };
    // this.getDraggedPattern = function() {
    //     var p;
    //     for (var i = 0; i < this.patterns.length; i++) {
    //         p = this.patterns[i];
    //         if (p.dragged === true) {
    //             return p;
    //         }
    //     }
    // };
    // this.deletePattern = function() {
    //     this.patterns.pop();    
        
    // };
   
    // this.button = new Button(100, 60, 10, 5, "white", startButtonCallback);
    // this.onMouseMove = function(x, y) {
    //     console.log("patternPanel");
    //     if (x >= this.button.x && x <= this.button.x + this.button.w && y >= this.button.y && y <= this.button.y + this.button.h) {
    //         this.button.select();
    //     } else {
    //         this.button.deSelect();
    //     }
    // }
    // this.onMouseClick = function(x, y) {
    //     if (x >= this.button.x && x <= this.button.x + this.button.w && y >= this.button.y && y <= this.button.y + this.button.h) {
    //         this.button.onClick();
    //     } 
    // }
    // this.onMouseDown = function(x, y) {
    //     var p;
    //     for (var i in this.patterns) {
    //         p = this.patterns[i];
    //         if (x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height) {
    //             p.dragged = true;
    //         }
    //     }
    // }
    // this.render = function(engine) {
    //     engine.drawRect(this.x, this.y, this.w, this.h, this.color);
    //     //this.button.render(engine);

        
    //     // for (var i = 0; i < this.patterns.length; i++) {
    //     //     this.patterns[i].render(engine);
    //     // }
    // };

};

