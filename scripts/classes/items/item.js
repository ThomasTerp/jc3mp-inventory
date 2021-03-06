"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector2Grid_1 = require("./../vector2Grid");
var util = require("./../../util");
var Item = (function () {
    function Item() {
        this.rotation = 0;
        this.isFlipped = false;
        this.category = "Misc";
        this.destroyOnUse = true;
        this.name = "Item";
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
    Item.prototype.canUse = function (player) {
        return true;
    };
    Item.prototype.use = function (player) {
    };
    Item.prototype.canDestroy = function (player) {
        return true;
    };
    Item.prototype.destroy = function () {
    };
    Item.prototype.getDefaultSlotsClone = function () {
        return util.cloneObject(this.defaultSlots);
    };
    Item.prototype.getDefaultSize = function () {
        return new vector2Grid_1.Vector2Grid(this.defaultSlots[0].length, this.defaultSlots.length);
    };
    Item.prototype.getSize = function () {
        return new vector2Grid_1.Vector2Grid(this.slots[0].length, this.slots.length);
    };
    Item.prototype.updateSlots = function () {
        this.slots = this.getDefaultSlotsClone();
        if (this.isFlipped) {
            for (var rows = 0; rows < this.getDefaultSize().rows; rows++) {
                this.slots[rows].reverse();
            }
        }
        this.slots = util.rotateMatrix(this.slots, this.rotation);
    };
    return Item;
}());
exports.Item = Item;
