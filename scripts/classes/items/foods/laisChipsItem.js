"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var foodItem_1 = require("./foodItem");
var itemFactory_1 = require("./../../itemFactory");
var itemFactoryManager = require("./../../../managers/itemFactoryManager");
var LaisChipsItem = (function (_super) {
    __extends(LaisChipsItem, _super);
    function LaisChipsItem() {
        var _this = _super.call(this) || this;
        _this.hunger = 60;
        _this.thirst = -20;
        _this.name = "Lais Chips";
        _this.defaultSlots = [
            [1, 1],
            [1, 1],
            [1, 1],
        ];
        return _this;
    }
    return LaisChipsItem;
}(foodItem_1.FoodItem));
exports.LaisChipsItem = LaisChipsItem;
itemFactoryManager.add(LaisChipsItem.name, "default", new itemFactory_1.ItemFactory(function () {
    return new LaisChipsItem();
}));
