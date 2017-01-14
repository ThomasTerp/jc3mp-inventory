"use strict";
var Util = require("./../../util");
var Item = (function () {
    function Item() {
        this.id = null;
        this.inventory = null;
        this.inventoryPosition = null;
        this.rotation = 0;
        this.isFlipped = false;
        this.category = "Misc";
        this.name = "Item " + (this.id === null ? "(NULL ID)" : this.id);
        this.defaultSlots = [
            [1, 1],
            [1, 1],
        ];
    }
    Object.defineProperty(Item.prototype, "defaultSlots", {
        get: function () {
            return this._defaultSlots;
        },
        set: function (value) {
            this._defaultSlots = value;
            this.slots = this.getDefaultSlotsClone();
        },
        enumerable: true,
        configurable: true
    });
    Item.prototype.getDefaultSlotsClone = function () {
        return Util.cloneObject(this.defaultSlots);
    };
    Item.prototype.getDefaultSize = function () {
        return new Vector2(this.defaultSlots[0].length, this.defaultSlots.length);
    };
    Item.prototype.getSize = function () {
        return new Vector2(this.slots[0].length, this.slots.length);
    };
    Item.prototype.updateSlots = function () {
        this.slots = this.getDefaultSlotsClone();
        if (this.isFlipped) {
            for (var y = 0; y < this.getDefaultSize().y; y++) {
                this.slots[y].reverse();
            }
        }
        this.slots = Util.rotateMatrix(this.slots, this.rotation);
    };
    return Item;
}());
exports.Item = Item;
