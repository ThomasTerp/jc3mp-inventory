"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector2Grid_1 = require("./../vector2Grid");
var Inventory = (function () {
    function Inventory(name, size) {
        this.name = name;
        this.items = [];
        this.size = size;
        this.slots = [];
        this.createSlots();
    }
    Inventory.prototype.createSlots = function () {
        for (var rows = 0; rows < this.size.rows; rows++) {
            this.slots[rows] = [];
            for (var cols = 0; cols < this.size.cols; cols++) {
                this.slots[rows][cols] = new InventorySlot(this, new vector2Grid_1.Vector2Grid(cols, rows));
            }
        }
    };
    Inventory.prototype.getSlot = function (position) {
        return this.slots[position.rows][position.cols];
    };
    Inventory.prototype.setSlotsItem = function (item) {
        for (var rows = 0; rows < item.slots.length; rows++) {
            for (var cols = 0; cols < item.slots[rows].length; cols++) {
                var isSolid = item.slots[rows][cols] == 1;
                if (isSolid) {
                    var slot = this.getSlot(new vector2Grid_1.Vector2Grid(item.inventoryPosition.cols + cols, item.inventoryPosition.rows + rows));
                    slot.item = item;
                }
            }
        }
    };
    Inventory.prototype.unsetSlotsItem = function (item) {
        for (var rows = 0; rows < item.slots.length; rows++) {
            for (var cols = 0; cols < item.slots[rows].length; cols++) {
                var isSolid = item.slots[rows][cols] == 1;
                if (isSolid) {
                    var slot = this.getSlot(new vector2Grid_1.Vector2Grid(item.inventoryPosition.cols + cols, item.inventoryPosition.rows + rows));
                    slot.item = undefined;
                }
            }
        }
    };
    Inventory.prototype.addItem = function (item, position) {
        if (!this.hasItem(item)) {
            this.items.push(item);
            item.inventory = this;
            item.inventoryPosition = position;
            this.setSlotsItem(item);
        }
    };
    Inventory.prototype.removeItem = function (item) {
        if (this.hasItem(item)) {
            this.unsetSlotsItem(item);
            item.inventory = undefined;
            item.inventoryPosition = undefined;
            this.items.splice(this.items.indexOf(item), 1);
        }
    };
    Inventory.prototype.hasItem = function (item) {
        return this.items.indexOf(item) === -1 ? false : true;
    };
    Inventory.prototype.isItemWithinInventory = function (item, position) {
        var itemSize = item.getSize();
        return position.cols + itemSize.cols <= this.size.cols && position.rows + itemSize.rows <= this.size.rows;
    };
    Inventory.prototype.canItemBePlaced = function (item, position) {
        var itemSize = item.getSize();
        for (var rows = 0; rows < itemSize.rows; rows++) {
            for (var cols = 0; cols < itemSize.cols; cols++) {
                var isSolid = item.slots[rows][cols] === 1;
                if (isSolid) {
                    var slot = this.getSlot(new vector2Grid_1.Vector2Grid(position.cols + cols, position.rows + rows));
                    if (slot.item != undefined) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    Inventory.prototype.hasAccess = function (player) {
        return true;
    };
    return Inventory;
}());
exports.Inventory = Inventory;
var InventorySlot = (function () {
    function InventorySlot(inventoryWindow, position) {
        this.inventory = inventoryWindow;
        this.position = position;
    }
    return InventorySlot;
}());
exports.InventorySlot = InventorySlot;
