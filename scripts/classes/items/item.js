"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ItemTypeManager = require("./../../managers/itemTypeManager");
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
        return {
            width: this.defaultSlots[0].length,
            height: this.defaultSlots.length
        };
    };
    Item.prototype.getSize = function () {
        return {
            width: this.slots[0].length,
            height: this.slots.length
        };
    };
    Item.prototype.updateSlots = function () {
        this.slots = this.getDefaultSlotsClone();
        if (this.isFlipped) {
            for (var y = 0; y < this.getDefaultSize().height; y++) {
                this.slots[y].reverse();
            }
        }
        this.slots = Util.rotateMatrix(this.slots, this.rotation);
    };
    return Item;
}());
exports.Item = Item;
var GasCanItem = (function (_super) {
    __extends(GasCanItem, _super);
    function GasCanItem() {
        var _this = _super.call(this) || this;
        _this.name = "Gas Can";
        _this.defaultSlots = [
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
        ];
        return _this;
    }
    return GasCanItem;
}(Item));
exports.GasCanItem = GasCanItem;
ItemTypeManager.add(GasCanItem.name, [
    function () {
        return new GasCanItem();
    }
]);
