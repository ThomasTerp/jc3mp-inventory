"use strict";
var inventorySlot_1 = require("./inventorySlot");
var Inventory = (function () {
    function Inventory(size) {
        this.uniqueName = null;
        this.items = [];
        this.size = size;
        this.slots = [];
        this.createSlots();
    }
    Inventory.prototype.createSlots = function () {
        for (var y = 0; y < this.size.y; y++) {
            this.slots[y] = [];
            for (var x = 0; x < this.size.x; x++) {
                this.slots[y][x] = new inventorySlot_1.InventorySlot(this, new Vector2(x, y));
            }
        }
    };
    Inventory.prototype.getSlot = function (position) {
        return this.slots[position.y][position.x];
    };
    Inventory.prototype.setSlotsItem = function (item) {
        for (var y = 0; y < item.slots.length; y++) {
            for (var x = 0; x < item.slots[y].length; x++) {
                var isSolid = item.slots[y][x] == 1;
                if (isSolid) {
                    var slot = this.getSlot(new Vector2(item.inventoryPosition.x + x, item.inventoryPosition.y + y));
                    slot.item = item;
                }
            }
        }
    };
    Inventory.prototype.unsetSlotsItem = function (item) {
        for (var y = 0; y < item.slots.length; y++) {
            for (var x = 0; x < item.slots[y].length; x++) {
                var isSolid = item.slots[y][x] == 1;
                if (isSolid) {
                    var slot = this.getSlot(new Vector2(item.inventoryPosition.x + x, item.inventoryPosition.y + y));
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
            item.inventory = null;
            item.inventoryPosition = null;
            this.items.splice(this.items.indexOf(item), 1);
        }
    };
    Inventory.prototype.hasItem = function (item) {
        return this.items.indexOf(item) === -1 ? false : true;
    };
    Inventory.prototype.isItemWithinInventory = function (item, position) {
        var itemSize = item.getSize();
        return position.x + itemSize.x <= this.size.x && position.y + itemSize.y <= this.size.y;
    };
    Inventory.prototype.canItemBePlaced = function (item, position) {
        var itemSize = item.getSize();
        for (var y = 0; y < itemSize.y; y++) {
            for (var x = 0; x < itemSize.x; x++) {
                var isSolid = item.slots[y][x] == 1;
                if (isSolid) {
                    var slot = this.getSlot(new Vector2(position.x + x, position.y + y));
                    if (slot.item) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    return Inventory;
}());
exports.Inventory = Inventory;
